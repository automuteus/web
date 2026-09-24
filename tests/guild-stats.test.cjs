const fs = require("node:fs");
const ts = require("typescript");
for (const ext of [".ts", ".tsx"]) {
    require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
        fileName: filename,
    }).outputText, filename);
}
require.extensions[".css"] = (module) => { module.exports = new Proxy({}, { get: (_, key) => key === "__esModule" ? false : key }); };
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { parseGuildStats, premiumActive, playerName, percent, previewFree, avatarURL, defaultAvatar } = require("../components/stats/guild-stats.ts");
const { default: GuildStatsView } = require("../components/stats/GuildStatsView.tsx");
const fixture = require("./fixtures/guild-stats.json");

function render(stats, props = {}) {
    return renderToStaticMarkup(React.createElement(GuildStatsView, { stats, ...props }));
}

test("Go stats fixture parses to the same document, with unknown fields dropped", () => {
    const noisy = { ...fixture, extra: 1, summary: { ...fixture.summary, extra: true }, leaderboards: { ...fixture.leaderboards, extra: [] },
        players: { ...fixture.players, "223456789012345678": { ...fixture.players["223456789012345678"], banner: "x" } } };
    assert.deepEqual(parseGuildStats(noisy), fixture);
    assert.ok(!("extra" in parseGuildStats(noisy).leaderboards));
});

test("a leaderboard size from an older API is ignored rather than rejected", () => {
    const parsed = parseGuildStats({ ...fixture, leaderboards: { ...fixture.leaderboards, size: 3 } });
    assert.ok(!("size" in parsed.leaderboards));
});

test("free documents have no leaderboards and tolerate missing players", () => {
    const { leaderboards, players, ...free } = fixture;
    const parsed = parseGuildStats(free);
    assert.equal(parsed.leaderboards, undefined);
    assert.deepEqual(parsed.players, {});
    assert.equal(parseGuildStats({ ...free, leaderboards: null }).leaderboards, undefined);
});

test("malformed documents are rejected rather than partially accepted", () => {
    const bad = [
        { ...fixture, guildId: "abc" },
        { ...fixture, summary: undefined },
        { ...fixture, summary: { ...fixture.summary, gamesPlayed: "8" } },
        { ...fixture, summary: { ...fixture.summary, crewmateWinrate: NaN } },
        { ...fixture, summary: { ...fixture.summary, impostorWins: -1 } },
        { ...fixture, premium: { tier: "3", days: 1 } },
        { ...fixture, leaderboards: { ...fixture.leaderboards, killedBy: undefined } },
        { ...fixture, leaderboards: { ...fixture.leaderboards, winrate: [{ userId: "223456789012345678", wins: 1, games: 1 }] } },
        { ...fixture, leaderboards: { ...fixture.leaderboards, mostGames: [{ userId: "<script>", games: 1 }] } },
        { ...fixture, leaderboards: { ...fixture.leaderboards, bestCrewmateDuo: [{ userId: "223456789012345678", teammateId: 5, wins: 1, games: 1, winrate: 100 }] } },
        [],
        "document",
        null,
    ];
    for (const doc of bad) assert.throws(() => parseGuildStats(doc), /Invalid guild stats/, JSON.stringify(doc));
});

test("player names are optional and only snowflake keys with a username are kept", () => {
    const parsed = parseGuildStats({ ...fixture, players: {
        "223456789012345678": { username: "alice", nickname: "" },
        "323456789012345678": { username: "" },
        "423456789012345678": "bob",
        "__proto__": { username: "evil" },
        "constructor": { username: "evil" },
        "not-a-snowflake": { username: "x" },
    } });
    assert.deepEqual(Object.keys(parsed.players), ["223456789012345678"]);
    assert.deepEqual(parsed.players["223456789012345678"], { username: "alice" });
    assert.equal(playerName(parsed.players, "223456789012345678"), "alice");
    assert.equal(playerName(fixture.players, "223456789012345678"), "Al");
    assert.equal(playerName({ a: { username: "u", globalName: "Global" } }, "a"), "Global");
    assert.equal(playerName(fixture.players, "323456789012345678"), "bob");
    assert.equal(playerName(fixture.players, "999456789012345678"), undefined);
    assert.equal(playerName(fixture.players, "constructor"), undefined);
});

test("avatars come only from Discord's CDN, with Discord's default for everyone else", () => {
    const withAvatars = parseGuildStats({ ...fixture, players: {
        "223456789012345678": { username: "a", avatar: "https://cdn.discordapp.com/avatars/223456789012345678/0123456789abcdef0123456789abcdef.png?size=128" },
        "323456789012345678": { username: "b", avatar: "https://evil.example/x.png" },
        "423456789012345678": { username: "c", avatar: "javascript:alert(1)" },
        "523456789012345678": { username: "d", avatar: "https://cdn.discordapp.com/avatars/x/\"onerror=alert(1).png" },
    } });
    assert.ok(withAvatars.players["223456789012345678"].avatar);
    for (const id of ["323456789012345678", "423456789012345678", "523456789012345678"]) assert.equal(withAvatars.players[id].avatar, undefined);
    assert.equal(avatarURL(withAvatars.players, "223456789012345678"), withAvatars.players["223456789012345678"].avatar);
    // 323456789012345678 >> 22 mod 6 is 1; unknown IDs fall back the same way.
    assert.equal(avatarURL(withAvatars.players, "323456789012345678"), "https://cdn.discordapp.com/embed/avatars/1.png");
    assert.equal(avatarURL({}, "323456789012345678"), "https://cdn.discordapp.com/embed/avatars/1.png");
    assert.equal(defaultAvatar("garbage"), "https://cdn.discordapp.com/embed/avatars/0.png");
});

test("premium mirrors the Go expiry rule and percentages drop a trailing zero", () => {
    assert.equal(premiumActive({ tier: 0, days: -9999 }), false);
    assert.equal(premiumActive({ tier: 3, days: 0 }), false);
    assert.equal(premiumActive({ tier: 3, days: 1 }), true);
    assert.equal(premiumActive({ tier: 5, days: -9999 }), true);
    assert.equal(percent(62.5), "62.5%");
    assert.equal(percent(25), "25%");
    assert.equal(percent(0), "0%");
});

test("premium fixture renders the summary, every board, cached names, and ID fallbacks", () => {
    const html = render(fixture);
    for (const value of ["games played", ">8<", "crewmate wins", "impostor wins", "Hall of fame", "Most games", "Best winrate", "Top crewmate", "Best duo", "First to go",
        "Overall winrate", "Crewmate winrate", "Impostor winrate", "Best crewmate duos", "Worst crewmate duos",
        "Best impostor duos", "Worst impostor duos", "First to die", "Killed by", "Al", "bob", "83.3%", "66.7%"]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    // No impostor winrate entry, so no "Top impostor" card.
    assert.ok(!html.includes("Top impostor"));
    // alice has a nickname, so neither her username nor global name is shown; the third player has no cached name
    // and shows as an ID with Discord's default avatar.
    assert.ok(!html.includes(">alice<"));
    assert.ok(!html.includes(">Alice<"));
    assert.ok(html.includes("423456789012345678"));
    assert.ok(html.includes(fixture.players["223456789012345678"].avatar.replace(/&/g, "&amp;")));
    assert.ok(html.includes("https://cdn.discordapp.com/embed/avatars/"));
    assert.ok(/referrerpolicy="no-referrer"/i.test(html));
    // Medal ranks on the top three.
    assert.ok(html.includes("gold"));
    assert.ok(html.includes("silver"));
    assert.ok(html.includes("bronze"));
    // Empty boards explain the minimum instead of showing an empty table.
    assert.ok(html.includes("No one has played 3 games in this role yet."));
    assert.ok(html.includes("No two players have been crewmates together in 3 games yet."));
    assert.ok(html.includes("impostor duos need 2 games together"));
    assert.ok(!html.includes("premium feature"));
    assert.ok(!html.includes("Games played"));
    // Two series in the share bar, so both are in the legend with their values.
    assert.ok(html.includes("Crewmates <strong>62.5%</strong>"));
    assert.ok(html.includes("Impostors <strong>25%</strong>"));
    assert.ok(html.includes("No result recorded <strong>12.5%</strong>"));
    assert.ok(html.includes('dateTime="2025-09-23T04:00:00.000Z"'));
});

test("free documents show the same layout with blurred sample boards and a premium link for this server", () => {
    const { leaderboards, ...free } = fixture;
    const html = render({ ...free, premium: { tier: 0, days: -9999 }, players: {} });
    assert.ok(html.includes("games played"));
    assert.ok(html.includes("Crewmates <strong>62.5%</strong>"));
    assert.ok(html.includes("Leaderboards are a premium feature"));
    assert.ok(html.includes('href="/premium?guild=123456789012345678"'));
    // The sample section is there for the eye only.
    assert.ok(html.includes('aria-hidden="true"'));
    assert.ok(html.includes("Hall of fame"));
    assert.ok(html.includes("Most games"));
    assert.ok(html.includes("<table"));
    // Nothing about the server's real players leaks into the locked layout, and the sample users are not real.
    assert.ok(!html.includes("Al"));
    assert.ok(!html.includes("bob"));
    assert.ok(!html.includes("223456789012345678"));
    assert.ok(html.includes("900000000000000001"));
});

test("the free preview strips the boards and names but keeps the summary, without touching the original", () => {
    const preview = previewFree(fixture);
    assert.equal(preview.leaderboards, undefined);
    assert.deepEqual(preview.premium, { tier: 0, days: -9999 });
    assert.deepEqual(preview.players, {});
    assert.deepEqual(preview.summary, fixture.summary);
    assert.equal(premiumActive(preview.premium), false);
    assert.ok(fixture.leaderboards);
    const html = render(preview);
    assert.ok(html.includes("Leaderboards are a premium feature"));
    assert.ok(html.includes('href="/premium?guild=123456789012345678"'));
    assert.ok(!html.includes(">Al<"));
});

test("a server with no games shows zeros, no share bar, and no NaN", () => {
    const { leaderboards, ...free } = fixture;
    const html = render({ ...free, summary: { gamesPlayed: 0, crewmateWins: 0, impostorWins: 0, crewmateWinrate: 0, impostorWinrate: 0 }, players: {} });
    assert.ok(html.includes(">0<"));
    assert.ok(!html.includes("Crewmates <strong>"));
    assert.ok(!html.includes("NaN"));
});

test("the signed-in user's own entries are highlighted and badged", () => {
    const plain = render(fixture);
    assert.ok(!plain.includes(">You<"));
    assert.ok(!plain.includes('class="me"'));
    // alice (223...) leads most games, winrate, and both duos, and is the impostor in the killed-by row.
    const html = render(fixture, { currentUserId: "223456789012345678" });
    const badges = (html.match(/>You</g) || []).length;
    assert.ok(badges >= 6, `only ${badges} badges`);
    assert.ok(html.includes('class="me"'));
    assert.ok(html.includes("spotlightMe"));
    // A duo row is highlighted for either member.
    const asBob = render(fixture, { currentUserId: "323456789012345678" });
    assert.ok(asBob.includes('class="me"'));
    assert.ok(asBob.includes(">You<"));
    // Nobody on the boards: nothing highlighted. Locked sample boards never highlight anyone either.
    assert.ok(!render(fixture, { currentUserId: "999456789012345678" }).includes(">You<"));
    const { leaderboards, ...free } = fixture;
    assert.ok(!render({ ...free, players: {} }, { currentUserId: "900000000000000001" }).includes(">You<"));
});

test("cached names are escaped", () => {
    const html = render({ ...fixture, players: { "223456789012345678": { username: "<script>alert(1)</script>", nickname: "<img src=x onerror=alert(1)>" } } });
    assert.ok(!html.includes("<script>"));
    assert.ok(!html.includes("<img src=x"));
    assert.ok(!html.includes("<img src=x onerror=alert(1)>") && html.includes("&lt;img src=x onerror=alert(1)&gt;"));
    assert.ok(html.includes("&lt;img"));
});
