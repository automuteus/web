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
const settingsHandler = require("../pages/api/guild/settings.ts").default;
const { sanitizeFields } = require("../utils/server/settings-write.ts");
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

test("settings GET relays the version tag and PATCH forwards only whitelisted, valid fields with If-Match", async (t) => {
    mockFetch(t, async () => new Response(JSON.stringify({ language: "en" }), { status: 200, headers: { ETag: '"7"' } }));
    let res = response();
    await settingsHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.getHeader("ETag"), '"7"');

    let seen;
    mockFetch(t, async (url, init) => {
        seen = { url, init };
        return new Response(JSON.stringify({ language: "en", autoRefresh: true }), { status: 200, headers: { ETag: '"8"' } });
    });
    const patch = async (body, headers = {}) => {
        const req = { ...await request(), method: "PATCH", body };
        req.headers = { ...req.headers, ...headers };
        const res = response();
        await settingsHandler(req, res);
        return res;
    };
    res = await patch({ autoRefresh: true, delays: { delays: { LOBBY: { LOBBY: 0, TASKS: 3, DISCUSSION: 0 }, TASKS: { LOBBY: 1, TASKS: 0, DISCUSSION: 0 }, DISCUSSION: { LOBBY: 6, TASKS: 7, DISCUSSION: 0 } } } }, { "if-match": '"7"' });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { language: "en", autoRefresh: true });
    assert.equal(res.getHeader("ETag"), '"8"');
    assert.equal(seen.init.method, "PATCH");
    assert.equal(seen.url.pathname, "/guild/settings");
    assert.equal(seen.url.searchParams.get("guildID"), guild);
    assert.equal(seen.init.headers.Authorization, "Bearer discord-access");
    assert.equal(seen.init.headers["If-Match"], '"7"');
    assert.equal(seen.init.headers["Content-Type"], "application/json");
    assert.deepEqual(Object.keys(JSON.parse(seen.init.body)).sort(), ["autoRefresh", "delays"]);

    // A malformed If-Match is dropped rather than forwarded.
    seen = undefined;
    res = await patch({ autoRefresh: false }, { "if-match": "<script>" });
    assert.equal(res.statusCode, 200);
    assert.equal(seen.init.headers["If-Match"], undefined);

    // Locked, unknown, invalid, and empty bodies never reach upstream.
    let calls = 0;
    mockFetch(t, async () => { calls++; throw new Error("unexpected fetch"); });
    for (const [body, field] of [[{ language: "xx" }, "language"], [{ matchSummaryChannelID: "general" }, "matchSummaryChannelID"], [{ adminIDs: [] }, "adminIDs"], [{ permissionRoleIDs: ["general"] }, "permissionRoleIDs[0]"], [{ evil: 1 }, "evil"],
        [{ mapVersion: "3d" }, "mapVersion"], [{ deleteGameSummary: 61 }, "deleteGameSummary"], [{ autoRefresh: "yes" }, "autoRefresh"]]) {
        res = await patch(body);
        assert.equal(res.statusCode, 400, field);
        assert.equal(res.body.fields[0].field, field);
    }
    for (const body of [{}, [], "text", null, undefined]) {
        res = await patch(body);
        assert.equal(res.statusCode, 400);
    }
    res = await patch({ autoRefresh: true }, {});
    assert.equal(calls, 1, "only the valid body reached the (failing) upstream");
    assert.equal(res.statusCode, 502);
});

test("settings PATCH relays upstream outcomes without reflecting arbitrary bodies", async (t) => {
    const patch = async (upstream, headers = {}) => {
        mockFetch(t, async () => upstream);
        const req = { ...await request(), method: "PATCH", body: { autoRefresh: true } };
        req.headers = { ...req.headers, ...headers };
        const res = response();
        await settingsHandler(req, res);
        return res;
    };
    let res = await patch(json({ StatusCode: 400, Error: "2 invalid setting(s)", fields: [{ field: "delays.delays.LOBBY.TASKS", message: "must be between 0 and 10" }, { field: "<img>", message: "x" }, { field: "mapVersion", message: 5 }, "junk"] }, 400));
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: "1 setting was rejected.", fields: [{ field: "delays.delays.LOBBY.TASKS", message: "must be between 0 and 10" }] });

    res = await patch(json({ StatusCode: 403, Error: "premium required to change: autoRefresh", fields: [{ field: "autoRefresh", message: "changing this setting requires premium" }] }, 403));
    assert.equal(res.statusCode, 403);
    assert.equal(res.body.error, "Premium is required to change some of these settings.");
    assert.equal(res.body.fields[0].field, "autoRefresh");

    res = await patch(json({ StatusCode: 403, Error: "secret internal detail" }, 403));
    assert.deepEqual(res.body, { error: "Access denied for this guild" });

    res = await patch(new Response(JSON.stringify({ Error: "moved on" }), { status: 412, headers: { ETag: '"9"' } }));
    assert.equal(res.statusCode, 412);
    assert.equal(res.getHeader("ETag"), '"9"');
    assert.match(res.body.error, /changed elsewhere/);
    res = await patch(json({ Error: "conflict" }, 409));
    assert.equal(res.statusCode, 409);
    assert.match(res.body.error, /changed elsewhere/);

    res = await patch(new Response("{}", { status: 429, headers: { "Retry-After": "42" } }));
    assert.equal(res.statusCode, 429);
    assert.equal(res.getHeader("Retry-After"), "42");

    for (const [upstream, status] of [[json({ Error: "x" }, 401), 401], [json({ Error: "x" }, 413), 413], [json({ Error: "x" }, 501), 501], [json({ Error: "x" }, 503), 503], [json({ Error: "secret" }, 500), 502], [json({ nope: true }), 502]]) {
        res = await patch(upstream);
        assert.equal(res.statusCode, status);
        assert.ok(!JSON.stringify(res.body).includes("secret"));
        assert.ok(!JSON.stringify(res.body).includes("discord-access"));
    }
    assert.equal(sanitizeFields(undefined), undefined);
    assert.equal(sanitizeFields([{ field: "a b", message: "x" }]), undefined);
    assert.equal(sanitizeFields([{ field: "ok", message: "y".repeat(400) }])[0].message.length, 300);

    // Other methods are refused with the full Allow list.
    const other = response();
    await settingsHandler({ ...await request(), method: "DELETE" }, other);
    assert.equal(other.statusCode, 405);
    assert.equal(other.getHeader("Allow"), "GET, PATCH");
});

test("channel check route requires a channel ID, forwards it, and returns only the expected shape", async (t) => {
    const channelHandler = require("../pages/api/guild/channel.ts").default;
    let seen;
    mockFetch(t, async (url) => { seen = url; return json({ id: "223456789012345678", name: "match-summaries", ok: true, problems: [], extra: "dropped" }); });
    let res = response();
    await channelHandler(await request({}, { guildID: guild, channelID: "223456789012345678" }), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { id: "223456789012345678", name: "match-summaries", ok: true, problems: [] });
    assert.equal(seen.pathname, "/guild/channel");
    assert.equal(seen.searchParams.get("channelID"), "223456789012345678");

    mockFetch(t, async () => json({ id: "223456789012345678", ok: false, problems: ["must be a channel in this guild"] }));
    res = response();
    await channelHandler(await request({}, { guildID: guild, channelID: "223456789012345678" }), res);
    assert.deepEqual(res.body, { id: "223456789012345678", ok: false, problems: ["must be a channel in this guild"] });

    let calls = 0;
    mockFetch(t, async () => { calls++; throw new Error("unexpected fetch"); });
    for (const query of [{ guildID: guild }, { guildID: guild, channelID: "general" }, { guildID: guild, channelID: ["223456789012345678"] }]) {
        res = response();
        await channelHandler(await request({}, query), res);
        assert.equal(res.statusCode, 400);
    }
    assert.equal(calls, 0);
    for (const [upstream, status] of [[json({ ok: true, problems: ["x"] }), 502], [json({ ok: "yes", problems: [] }), 502], [json({ Error: "no token" }, 501), 501], [json({}, 503), 503]]) {
        mockFetch(t, async () => upstream);
        res = response();
        await channelHandler(await request({}, { guildID: guild, channelID: "223456789012345678" }), res);
        assert.equal(res.statusCode, status);
    }
});

test("roles route forwards the guild and returns a validated, trimmed role list", async (t) => {
    const rolesHandler = require("../pages/api/guild/roles.ts").default;
    mockFetch(t, async (url) => { assert.equal(url.pathname, "/guild/roles"); return json([
        { id: "234567890123456789", name: "Mods", color: 16711680, position: 2, managed: false, extra: 1 },
        { id: "999999999999999999", name: "x".repeat(200), color: -5, position: 1 },
    ]); });
    let res = response();
    await rolesHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, [
        { id: "234567890123456789", name: "Mods", color: 16711680, position: 2, managed: false },
        { id: "999999999999999999", name: "x".repeat(100), color: 0, position: 1, managed: false },
    ]);
    for (const [upstream, status] of [[json({ not: "a list" }), 502], [json([{ id: "bad", name: "x", color: 0, position: 0 }]), 502], [json([{ id: "234567890123456789" }]), 502], [json({ Error: "gone" }, 404), 404], [json({}, 501), 501]]) {
        mockFetch(t, async () => upstream);
        res = response();
        await rolesHandler(await request(), res);
        assert.equal(res.statusCode, status);
    }
});

test("channels route forwards the guild and returns a validated, trimmed channel list", async (t) => {
    const channelsHandler = require("../pages/api/guild/channels.ts").default;
    mockFetch(t, async (url) => { assert.equal(url.pathname, "/guild/channels"); return json([
        { id: "223456789012345678", name: "match-summaries", type: 0, category: "", ok: true, problems: [], extra: 1 },
        { id: "223456789012345679", name: "x".repeat(200), type: 5, category: "y".repeat(200), ok: false, problems: ["the bot is missing the Embed Links permission in this channel", 7] },
        { id: "223456789012345680", name: "no-category-field", type: 0, ok: true, problems: [] },
    ]); });
    let res = response();
    await channelsHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, [
        { id: "223456789012345678", name: "match-summaries", type: 0, category: "", ok: true, problems: [] },
        { id: "223456789012345679", name: "x".repeat(100), type: 5, category: "y".repeat(100), ok: false, problems: ["the bot is missing the Embed Links permission in this channel"] },
        { id: "223456789012345680", name: "no-category-field", type: 0, category: "", ok: true, problems: [] },
    ]);
    for (const [upstream, status] of [
        [json({ not: "a list" }), 502],
        [json([{ id: "bad", name: "x", type: 0, ok: true, problems: [] }]), 502],
        [json([{ id: "223456789012345678", name: "x", type: 0, ok: "yes", problems: [] }]), 502],
        [json([{ id: "223456789012345678", name: "x", type: 0, ok: true }]), 502],
        [json({ Error: "gone" }, 404), 404],
        [json({}, 501), 501],
    ]) {
        mockFetch(t, async () => upstream);
        res = response();
        await channelsHandler(await request(), res);
        assert.equal(res.statusCode, status);
    }
});

test("stats route forwards the guild and returns a validated, trimmed document", async (t) => {
    const statsHandler = require("../pages/api/guild/stats.ts").default;
    const fixture = require("./fixtures/guild-stats.json");
    let calls = 0;
    mockFetch(t, async (url, init) => {
        calls++;
        assert.equal(url.pathname, "/guild/stats");
        assert.equal(url.searchParams.get("guildID"), guild);
        assert.deepEqual(init.headers, { Authorization: "Bearer discord-access", Accept: "application/json" });
        return json({ ...fixture, secret: "upstream-only", players: { ...fixture.players, "__proto__": { username: "evil" } } });
    });
    let res = response();
    await statsHandler(await request(), res);
    assert.equal(calls, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, fixture);
    assert.equal(res.getHeader("Cache-Control"), "no-store");
    // A document the page cannot trust is a 502, never a partial object.
    mockFetch(t, async () => json({ ...fixture, summary: { gamesPlayed: "many" } }));
    res = response();
    await statsHandler(await request(), res);
    assert.equal(res.statusCode, 502);
    assert.deepEqual(res.body, { error: "API request failed" });
    // The free tier document has no leaderboards and that is valid.
    const { leaderboards, players, ...free } = fixture;
    mockFetch(t, async () => json(free));
    res = response();
    await statsHandler(await request(), res);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { ...free, players: {} });
});

test("match route forwards only a canonical match ID and returns a validated, trimmed document", async (t) => {
    const matchHandler = require("../pages/api/guild/match.ts").default;
    const fixture = require("./fixtures/match-summary.json");
    let calls = 0;
    mockFetch(t, async (url, init) => {
        calls++;
        assert.equal(url.pathname, "/guild/match");
        assert.deepEqual([...url.searchParams.keys()].sort(), ["guildID", "matchID"]);
        assert.equal(url.searchParams.get("guildID"), guild);
        assert.equal(url.searchParams.get("matchID"), "42");
        assert.deepEqual(init.headers, { Authorization: "Bearer discord-access", Accept: "application/json" });
        return json({ ...fixture, connectCode: "ABCDEFGH" });
    });
    let res = response();
    await matchHandler(await request({}, { guildID: guild, matchID: "42", connectCode: "ABCDEFGH" }), res);
    assert.equal(calls, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, fixture);
    for (const matchID of [undefined, "", "0", "042", "-1", "4.2", "ABCDEFGH:42", "1234567890123456789", ["1", "2"]]) {
        res = response();
        await matchHandler(await request({}, { guildID: guild, matchID }), res);
        assert.equal(res.statusCode, 400, String(matchID));
        assert.deepEqual(res.body, { error: "Invalid match ID" });
    }
    assert.equal(calls, 1);
    // A missing match is relayed as 404 so the page can say so; a malformed document is a 502.
    mockFetch(t, async () => json({ error: "match not found" }, 404));
    res = response();
    await matchHandler(await request({}, { guildID: guild, matchID: "42" }), res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, { error: "Not found" });
    mockFetch(t, async () => json({ ...fixture, roster: "everyone" }));
    res = response();
    await matchHandler(await request({}, { guildID: guild, matchID: "42" }), res);
    assert.equal(res.statusCode, 502);
});

test("user route forwards only a snowflake user ID and returns a validated, trimmed document", async (t) => {
    const userHandler = require("../pages/api/guild/user.ts").default;
    const fixture = require("./fixtures/user-stats.json");
    const user = "400000000000000001";
    let calls = 0;
    mockFetch(t, async (url, init) => {
        calls++;
        assert.equal(url.pathname, "/guild/user");
        assert.deepEqual([...url.searchParams.keys()].sort(), ["guildID", "userID"]);
        assert.equal(url.searchParams.get("guildID"), guild);
        assert.equal(url.searchParams.get("userID"), user);
        assert.deepEqual(init.headers, { Authorization: "Bearer discord-access", Accept: "application/json" });
        return json({ ...fixture, secret: "upstream-only" });
    });
    let res = response();
    await userHandler(await request({}, { guildID: guild, userID: user, matchID: "42" }), res);
    assert.equal(calls, 1);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, fixture);
    for (const userID of [undefined, "", "42", "abc", `${user}x`, "123456789012345678901", [user, user]]) {
        res = response();
        await userHandler(await request({}, { guildID: guild, userID }), res);
        assert.equal(res.statusCode, 400, String(userID));
        assert.deepEqual(res.body, { error: "Invalid user ID" });
    }
    assert.equal(calls, 1);
    mockFetch(t, async () => json({ ...fixture, recentMatches: "lots" }));
    res = response();
    await userHandler(await request({}, { guildID: guild, userID: user }), res);
    assert.equal(res.statusCode, 502);
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

const resetRoutes = { "/guild/stats/reset": { guildID: guild }, "/guild/user/reset": { guildID: guild, userID: "223456789012345678" }, "/guild/settings/reset": { guildID: guild } };
async function resetRequest(endpoint, overrides = {}) {
    const req = await request({}, { ...resetRoutes[endpoint], admin: "true" });
    return { ...req, method: "POST", headers: { ...req.headers, "content-type": "application/json", "if-match": '"4"' }, body: {}, ...overrides };
}

test("reset routes POST only fixed targets with the session token, and relay a validated result", async (t) => {
    for (const endpoint of Object.keys(resetRoutes)) {
        let seen;
        mockFetch(t, async (url, init) => {
            seen = { url, init };
            if (endpoint === "/guild/settings/reset") return new Response(JSON.stringify({ language: "en", extra: 1 }), { status: 200, headers: { ETag: '"5"' } });
            return json({ guildId: guild, ...(endpoint === "/guild/user/reset" ? { userId: "223456789012345678" } : {}), games: 3, secret: "x" });
        });
        const res = response();
        await require(`../pages/api${endpoint}.ts`).default(await resetRequest(endpoint), res);
        assert.equal(res.statusCode, 200, endpoint);
        assert.equal(seen.url.origin + seen.url.pathname, "https://go.example.test" + endpoint);
        assert.deepEqual([...seen.url.searchParams.keys()].sort(), Object.keys(resetRoutes[endpoint]).sort());
        assert.equal(seen.init.method, "POST");
        assert.equal(seen.init.redirect, "error");
        assert.equal(seen.init.headers.Authorization, "Bearer discord-access");
        // Only the settings reset carries the version check.
        assert.equal(seen.init.headers["If-Match"], endpoint === "/guild/settings/reset" ? '"4"' : undefined);
        if (endpoint === "/guild/settings/reset") {
            assert.equal(res.getHeader("ETag"), '"5"');
            assert.equal(res.body.language, "en");
        } else {
            assert.equal(res.body.secret, undefined);
            assert.equal(res.body.games, 3);
        }
    }
});

test("reset routes refuse non-POST, non-JSON, and malformed targets before contacting the API", async (t) => {
    let calls = 0;
    mockFetch(t, async () => { calls++; return json({}); });
    const cases = [
        ["/guild/stats/reset", { method: "GET" }, 405],
        ["/guild/stats/reset", { headers: {} }, 415],
        ["/guild/stats/reset", { headers: { "content-type": "application/x-www-form-urlencoded" } }, 415],
        ["/guild/stats/reset", { query: { guildID: "abc" } }, 400],
        ["/guild/user/reset", { query: { guildID: guild } }, 400],
        ["/guild/user/reset", { query: { guildID: guild, userID: ["223456789012345678", "323456789012345678"] } }, 400],
    ];
    for (const [endpoint, overrides, status] of cases) {
        const req = await resetRequest(endpoint);
        if (overrides.headers) overrides.headers = { ...overrides.headers, cookie: req.headers.cookie };
        const res = response();
        await require(`../pages/api${endpoint}.ts`).default({ ...req, ...overrides }, res);
        assert.equal(res.statusCode, status, `${endpoint} ${JSON.stringify(overrides)}`);
    }
    assert.equal(calls, 0);
});

test("reset routes relay refusals without upstream bodies, and reject malformed success bodies", async (t) => {
    for (const status of [403, 409, 429, 500]) {
        mockFetch(t, async () => new Response(JSON.stringify({ Error: "postgres: secret detail" }), { status, headers: { "Retry-After": "30" } }));
        const res = response();
        await require("../pages/api/guild/stats/reset.ts").default(await resetRequest("/guild/stats/reset"), res);
        assert.equal(res.statusCode, status === 500 ? 502 : status);
        assert.ok(!JSON.stringify(res.body).includes("postgres"));
        assert.equal(res.getHeader("Retry-After"), status === 429 ? "30" : undefined);
    }
    for (const body of [{ guildId: guild, games: -1 }, { guildId: "1", games: 1 }, { guildId: guild, games: "3" }]) {
        mockFetch(t, async () => json(body));
        const res = response();
        await require("../pages/api/guild/stats/reset.ts").default(await resetRequest("/guild/stats/reset"), res);
        assert.equal(res.statusCode, 502, JSON.stringify(body));
    }
});

test("a refused player reset explains that players may reset only themselves", async (t) => {
    mockFetch(t, async () => new Response("", { status: 403 }));
    const res = response();
    await require("../pages/api/guild/user/reset.ts").default(await resetRequest("/guild/user/reset"), res);
    assert.equal(res.statusCode, 403);
    assert.match(res.body.error, /your own stats/);
});
