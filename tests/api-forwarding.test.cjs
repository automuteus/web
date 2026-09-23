// Transpile test imports with the already-installed TypeScript compiler.
// Type correctness is checked separately by `yarn typecheck`.
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    module._compile(ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
        fileName: filename,
    }).outputText, filename);
};

const { test } = require("node:test");
const assert = require("node:assert/strict");
process.env.NEXTAUTH_URL = "http://localhost:3000";
process.env.NEXTAUTH_SECRET = "test-only-session-secret-not-for-production";
process.env.DISCORD_CLIENT_ID = "test-client";
process.env.DISCORD_CLIENT_SECRET = "test-client-secret";
process.env.AUTOMUTEUS_API_URL = "https://go.example.test";
const { encode, decode } = require("next-auth/jwt");
const { getServerSession } = require("next-auth/next");
const { authOptions } = require("../utils/server/auth.ts");
const { createAPIReadHandler } = require("../utils/server/api-proxy.ts");
const guildsHandler = require("../pages/api/guilds.ts").default;
const { default: botHandler, inviteURL, BOT_PERMISSIONS } = require("../pages/api/guild/bot.ts");
const defaultsHandler = require("../pages/api/settings/defaults.ts").default;
const guild = "123456789012345678";

function response() {
    return {
        statusCode: 200, headers: {}, body: undefined,
        setHeader(name, value) { this.headers[name.toLowerCase()] = value; return this; },
        getHeader(name) { return this.headers[name.toLowerCase()]; },
        status(code) { this.statusCode = code; return this; },
        json(body) { this.body = body; return this; },
    };
}
async function request(token = {}, query = { guildID: guild }) {
    const cookie = await encode({ secret: process.env.NEXTAUTH_SECRET, token: {
        sub: "223456789012345678", accessToken: "discord-access", refreshToken: "discord-refresh",
        expiresAt: Math.floor(Date.now() / 1000) + 3600, ...token,
    } });
    return { method: "GET", headers: { authorization: "Basic malicious-browser-credential" },
        cookies: { "next-auth.session-token": cookie }, query };
}
const mockedTests = new WeakSet();
function mockFetch(t, fn) {
    if (!mockedTests.has(t)) {
        const previous = global.fetch;
        t.after(() => { global.fetch = previous; });
        mockedTests.add(t);
    }
    global.fetch = fn;
}
function json(body, status = 200) { return new Response(JSON.stringify(body), { status }); }

test("all four fixed routes forward only session credentials and approved parameters", async (t) => {
    for (const endpoint of ["/guild/settings", "/guild/premium", "/game/state", "/game/roomcode"]) {
        let calls = 0;
        mockFetch(t, async (url, init) => {
            calls++;
            assert.equal(url.origin, "https://go.example.test");
            assert.equal(url.pathname, endpoint);
            assert.equal(url.searchParams.get("guildID"), guild);
            assert.equal(url.searchParams.has("admin"), false);
            assert.equal(url.searchParams.has("url"), false);
            assert.equal(url.searchParams.has("connectCode"), endpoint.startsWith("/game/"));
            assert.deepEqual(init.headers, { Authorization: "Bearer discord-access", Accept: "application/json" });
            assert.equal(init.redirect, "error");
            assert.equal(init.cache, "no-store");
            assert.ok(init.signal instanceof AbortSignal);
            return json({ result: "member data" });
        });
        const req = await request({}, { guildID: guild, connectCode: "ABCDEFGH", admin: "true", url: "https://attacker.test" });
        const res = response();
        const handler = require(`../pages/api${endpoint}.ts`).default;
        await handler(req, res);
        assert.equal(calls, 1);
        assert.equal(res.statusCode, 200);
        assert.deepEqual(res.body, { result: "member data" });
        assert.equal(res.getHeader("Cache-Control"), "no-store");
        assert.ok(res.getHeader("Set-Cookie"));
        assert.ok(!JSON.stringify(res.body).includes("discord-access"));
    }
});

test("bot presence route adds a server-specific invite only when the bot is absent", async (t) => {
    process.env.DISCORD_CLIENT_ID = "753795015830011944";
    t.after(() => { process.env.DISCORD_CLIENT_ID = "test-client"; });
    mockFetch(t, async (url) => { assert.equal(url.pathname, "/guild/bot"); return json({ present: true, extra: "ignored" }); });
    let res = response();
    await botHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { present: true });

    mockFetch(t, async () => json({ present: false }));
    res = response();
    await botHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.present, false);
    const invite = new URL(res.body.invite);
    assert.equal(invite.origin + invite.pathname, "https://discord.com/oauth2/authorize");
    assert.equal(invite.searchParams.get("client_id"), "753795015830011944");
    assert.equal(invite.searchParams.get("guild_id"), guild);
    assert.equal(invite.searchParams.get("permissions"), BOT_PERMISSIONS);
    assert.equal(invite.searchParams.get("scope"), "bot applications.commands");
    assert.equal(invite.searchParams.get("disable_guild_select"), "true");
    assert.ok(!res.body.invite.includes("discord-access"));

    // Without a valid numeric client ID the page falls back to the generic invite; no half-built URL is sent.
    assert.equal(inviteURL(undefined, guild), undefined);
    assert.equal(inviteURL("test-client", guild), undefined);
    for (const body of [{ present: "yes" }, {}, null, [true]]) {
        mockFetch(t, async () => json(body));
        res = response();
        await botHandler(await request(), res);
        assert.equal(res.statusCode, 502);
    }
});

test("default settings route needs no session, sends no credentials, and is cacheable", async (t) => {
    const anonymous = { method: "GET", headers: {}, cookies: {}, query: {} };
    mockFetch(t, async (url, init) => {
        assert.equal(url.origin, "https://go.example.test");
        assert.equal(url.pathname, "/bot/settings/defaults");
        assert.deepEqual(init.headers, { Accept: "application/json" });
        assert.equal(init.redirect, "error");
        return json({ language: "en", mapVersion: "simple" });
    });
    let res = response();
    await defaultsHandler(anonymous, res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { language: "en", mapVersion: "simple" });
    assert.equal(res.getHeader("Cache-Control"), "public, max-age=300");

    for (const upstream of [async () => json({ nope: true }), async () => json([]), async () => json({}, 500), async () => { throw new Error("secret"); }]) {
        mockFetch(t, upstream);
        res = response();
        await defaultsHandler(anonymous, res);
        assert.equal(res.statusCode, 502);
        assert.equal(res.getHeader("Cache-Control"), "no-store");
        assert.ok(!JSON.stringify(res.body).includes("secret"));
    }
    let calls = 0;
    mockFetch(t, async () => { calls++; throw new Error("unexpected fetch"); });
    res = response();
    await defaultsHandler({ ...anonymous, method: "POST" }, res);
    assert.equal(res.statusCode, 405);
    assert.equal(calls, 0);
});

test("missing session and failed refresh never contact the Go API", async (t) => {
    mockFetch(t, async () => { throw new Error("should not fetch"); });
    for (const req of [
        { method: "GET", headers: {}, cookies: {}, query: { guildID: guild } },
        await request({ error: "RefreshAccessTokenError" }),
    ]) {
        const res = response();
        await createAPIReadHandler("/guild/settings")(req, res);
        assert.equal(res.statusCode, 401);
    }
});

test("methods, duplicate parameters, and malformed targets are rejected before upstream calls", async (t) => {
    let calls = 0;
    mockFetch(t, async () => { calls++; throw new Error("unexpected fetch"); });
    for (const [method, query, expected] of [
        ["POST", { guildID: guild }, 405],
        ["GET", { guildID: [guild, guild] }, 400],
        ["GET", { guildID: "../admin" }, 400],
        ["GET", { guildID: guild, connectCode: ["ABCDEFGH", "ABCDEFGH"] }, 400],
        ["GET", { guildID: guild, connectCode: "../admin" }, 400],
    ]) {
        const req = await request({}, query);
        req.method = method;
        const res = response();
        await createAPIReadHandler("/game/state")(req, res);
        assert.equal(res.statusCode, expected);
        if (expected === 405) assert.equal(res.getHeader("Allow"), "GET");
    }
    assert.equal(calls, 0);
    assert.throws(() => createAPIReadHandler("/admin/notice"));
});

test("expired access token refreshes before forwarding and persists rotated credentials", async (t) => {
    const calls = [];
    mockFetch(t, async (url, init) => {
        calls.push(String(url));
        if (String(url) === "https://discord.com/api/oauth2/token") {
            assert.equal(init.method, "POST");
            assert.equal(init.body.get("refresh_token"), "discord-refresh");
            assert.equal(init.redirect, "error");
            return json({ access_token: "new-access", refresh_token: "new-refresh", expires_in: 3600 });
        }
        assert.equal(init.headers.Authorization, "Bearer new-access");
        return json({ tier: 1 });
    });
    const res = response();
    await createAPIReadHandler("/guild/premium")(await request({ expiresAt: 1 }), res);
    assert.equal(res.statusCode, 200);
    assert.equal(calls.length, 2);
    const setCookies = res.getHeader("Set-Cookie");
    const cookie = setCookies.find((value) => value.startsWith("next-auth.session-token="));
    assert.ok(cookie);
    const value = decodeURIComponent(cookie.split(";")[0].slice("next-auth.session-token=".length));
    const token = await decode({ secret: process.env.NEXTAUTH_SECRET, token: value });
    assert.equal(token.accessToken, "new-access");
    assert.equal(token.refreshToken, "new-refresh");
    assert.ok(token.expiresAt > Date.now() / 1000);
});

test("refresh errors and malformed refresh responses fail closed", async (t) => {
    for (const upstream of [() => json({ error: "private detail" }, 400), () => json({ access_token: "bad", expires_in: "3600" })]) {
        let calls = 0;
        mockFetch(t, async (url) => {
            calls++;
            assert.equal(String(url), "https://discord.com/api/oauth2/token");
            return upstream();
        });
        const res = response();
        await createAPIReadHandler("/guild/settings")(await request({ expiresAt: 1 }), res);
        assert.equal(res.statusCode, 401);
        assert.equal(calls, 1);
        assert.ok(!JSON.stringify(res.body).includes("private"));
    }
});

test("public NextAuth session does not expose access or refresh tokens", async (t) => {
    mockFetch(t, async () => { throw new Error("unexpected fetch"); });
    const session = await getServerSession(await request(), response(), authOptions);
    assert.equal(session.user.id, "223456789012345678");
    assert.ok(!JSON.stringify(session).includes("discord-access"));
    assert.ok(!JSON.stringify(session).includes("discord-refresh"));
});

test("Go access errors retain status and never reflect upstream bodies", async (t) => {
    for (const status of [400, 401, 403, 404, 429, 503, 500, 302]) {
        mockFetch(t, async () => new Response("private upstream data", { status }));
        const res = response();
        await createAPIReadHandler("/guild/settings")(await request(), res);
        assert.equal(res.statusCode, [500, 302].includes(status) ? 502 : status);
        assert.ok(!JSON.stringify(res.body).includes("private upstream"));
    }
});

test("network failures, redirects rejected by fetch, and malformed success JSON return 502", async (t) => {
    for (const upstream of [
        async () => { throw new Error("connection credentials secret"); },
        async () => { throw new DOMException("timeout", "TimeoutError"); },
        async () => new Response("not JSON"),
    ]) {
        mockFetch(t, upstream);
        const res = response();
        await createAPIReadHandler("/guild/settings")(await request(), res);
        assert.equal(res.statusCode, 502);
        assert.deepEqual(res.body, { error: "API request failed" });
    }
});

test("guild picker keeps non-admin guilds and paginates Discord", async (t) => {
    let calls = 0;
    mockFetch(t, async (url, init) => {
        calls++;
        assert.equal(url.origin, "https://discord.com");
        assert.equal(init.headers.Authorization, "Bearer discord-access");
        assert.equal(url.searchParams.get("limit"), "200");
        const g = (id) => ({ id: String(id), name: "Guild", permissions: "0", owner: false, icon: null });
        if (calls === 1) return json(Array.from({ length: 200 }, (_, i) => g(123456789012345678n + BigInt(i))));
        assert.equal(url.searchParams.get("after"), "123456789012345877");
        return json([g(223456789012345678n)]);
    });
    const res = response();
    await guildsHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.length, 201);
    assert.ok(res.body.every((g) => g.permissions === "0" && g.owner === false));
    assert.equal(res.getHeader("Cache-Control"), "no-store");
});

test("guild picker rejects Discord guilds without an owner flag", async (t) => {
    mockFetch(t, async () => json([{ id: "123456789012345678", name: "Guild", permissions: "8", icon: null }]));
    const res = response();
    await guildsHandler(await request(), res);
    assert.equal(res.statusCode, 502);
});

test("guild picker also refreshes before contacting Discord", async (t) => {
    mockFetch(t, async (url, init) => {
        if (String(url).endsWith("/oauth2/token")) return json({ access_token: "new-access", expires_in: 3600 });
        assert.equal(init.headers.Authorization, "Bearer new-access");
        return json([]);
    });
    const res = response();
    await guildsHandler(await request({ expiresAt: 1 }), res);
    assert.equal(res.statusCode, 200);
    assert.ok(res.getHeader("Set-Cookie"));
});
