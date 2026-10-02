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
// Initializes i18next with the bundled English catalog, as _app does in the browser.
require("../utils/i18n.ts");
const { parseUserStats, previewFree, sampleDetails } = require("../components/stats/user-stats.ts");
const { default: UserStatsView } = require("../components/stats/UserStatsView.tsx");
const fixture = require("./fixtures/user-stats.json");

function render(stats, props = {}) {
    return renderToStaticMarkup(React.createElement(UserStatsView, { stats, ...props }));
}

test("Go user stats fixture parses to the same document, with unknown fields dropped", () => {
    const noisy = { ...fixture, secret: 1, summary: { ...fixture.summary, extra: true },
        recentMatches: fixture.recentMatches.map((m) => ({ ...m, connectCode: "ABCDEFGH" })),
        details: { ...fixture.details, extra: [], ranks: { ...fixture.details.ranks, other: { position: 1, players: 1 } } } };
    assert.deepEqual(parseUserStats(noisy), fixture);
});

test("the free document has no details, and a player with no games has no dates", () => {
    const { details, ...free } = fixture;
    assert.equal(parseUserStats(free).details, undefined);
    const { firstGame, lastGame, ...summary } = fixture.summary;
    const empty = parseUserStats({ ...free, summary: { ...summary, games: 0, wins: 0 }, recentMatches: [], players: undefined });
    assert.equal(empty.summary.firstGame, undefined);
    assert.equal(empty.summary.lastGame, undefined);
    assert.deepEqual(empty.players, {});
});

test("values a newer API might add are dropped, not fatal", () => {
    const parsed = parseUserStats({ ...fixture,
        recentMatches: [{ ...fixture.recentMatches[0], map: "newmap", result: "somethingNew", color: "fuchsia" }],
        details: { ...fixture.details, colors: [{ color: "fuchsia", games: 1, share: 12.5 }, ...fixture.details.colors],
            maps: [{ map: "newmap", games: 1, wins: 1, winrate: 100 }, ...fixture.details.maps] } });
    assert.equal(parsed.recentMatches[0].map, undefined);
    assert.equal(parsed.recentMatches[0].result, "unknown");
    assert.equal(parsed.recentMatches[0].color, "");
    assert.deepEqual(parsed.details.colors, fixture.details.colors);
    assert.deepEqual(parsed.details.maps, fixture.details.maps);
});

test("malformed documents are rejected rather than partially accepted", () => {
    const d = fixture.details;
    const bad = [
        { ...fixture, userId: "42" },
        { ...fixture, guildId: undefined },
        { ...fixture, summary: { ...fixture.summary, games: "8" } },
        { ...fixture, summary: { ...fixture.summary, crewmate: undefined } },
        { ...fixture, summary: { ...fixture.summary, firstGame: -1 } },
        { ...fixture, recentMatches: undefined },
        { ...fixture, recentMatches: [{ ...fixture.recentMatches[0], matchId: "042" }] },
        { ...fixture, recentMatches: [{ ...fixture.recentMatches[0], role: "ghost" }] },
        { ...fixture, recentMatches: [{ ...fixture.recentMatches[0], won: "yes" }] },
        { ...fixture, details: { ...d, streaks: { ...d.streaks, current: 1.5 } } },
        { ...fixture, details: { ...d, ranks: { winrate: { position: "1", players: 3 } } } },
        { ...fixture, details: { ...d, fates: { ...d.fates, votedOutAsImpostor: undefined } } },
        { ...fixture, details: { ...d, playedWith: [{ userId: "alice", games: 1, share: 1 }] } },
        { ...fixture, details: { ...d, killedBy: [{ ...d.killedBy[0], rate: Infinity }] } },
        { ...fixture, details: { ...d, activity: { until: 1, weeks: [1, -1] } } },
        { ...fixture, details: { ...d, bestCrewmateTeammates: null } },
    ];
    for (const doc of bad) assert.throws(() => parseUserStats(doc), /Invalid player stats/, JSON.stringify(doc).slice(0, 120));
    // A negative streak is a losing run, not an error.
    assert.equal(parseUserStats({ ...fixture, details: { ...d, streaks: { ...d.streaks, current: -3 } } }).details.streaks.current, -3);
});

test("previewFree hides the details and every other player's name", () => {
    const free = previewFree(fixture);
    assert.equal(free.details, undefined);
    assert.deepEqual(free.premium, { tier: 0, days: -9999 });
    assert.deepEqual(Object.keys(free.players), [fixture.userId]);
    assert.deepEqual(free.recentMatches, fixture.recentMatches);
});

test("premium view shows every section, with players and matches linked", () => {
    const html = render(fixture, { currentUserId: fixture.userId });
    for (const text of ["Bo", "You", "62.5%", "66.7%", "Recent matches", "Match 42", "The Airship", "Map not recorded", "Won", "No result",
        "Current streak", "1W", "Crewmate survival", "First to die", "Server ranks", "#1", "of 3", "Not ranked", "How games end",
        "Voted out as impostor", "Activity", "8 games in the last 12 weeks", "Maps", "The Skeld", "Favorite colors", "Names used", "Bobo",
        "Most played with", "alice", "Bobby", "Died most often with this impostor in the game", "Best crewmate teammates", "Worst impostor teammates"]) {
        assert.ok(html.includes(text), text);
    }
    assert.ok(html.includes('href="/stats/match?guild=123456789012345678&amp;match=42"'));
    assert.ok(html.includes('href="/stats/user?guild=123456789012345678&amp;user=400000000000000002"'));
    assert.ok(!html.includes("premium feature"));
    // The impostor nobody has a name for shows by ID, still linked.
    assert.ok(html.includes('href="/stats/user?guild=123456789012345678&amp;user=400000000000000004"'));
});

test("free view keeps the summary and recent matches, and locks a sample with no links under a premium prompt", () => {
    const html = render(previewFree(fixture), { preview: true });
    assert.ok(html.includes("62.5%"));
    assert.ok(html.includes("Match 42"));
    assert.ok(html.includes("preview=free"));
    assert.ok(html.includes("Detailed player stats are a premium feature"));
    assert.ok(html.includes('href="/premium?guild=123456789012345678"'));
    // The blurred sample never links to its made-up players, and none of the real teammates leak through.
    assert.ok(!html.includes("user=9000000000000000"));
    assert.ok(!html.includes("alice"));
    assert.ok(!html.includes(">You<"));
});

test("a player with no games gets a short note instead of empty sections", () => {
    const { firstGame, lastGame, ...summary } = fixture.summary;
    const stats = { ...fixture, summary: { ...summary, games: 0, wins: 0, winrate: 0, crewmate: { games: 0, wins: 0, winrate: 0 }, impostor: { games: 0, wins: 0, winrate: 0 } }, recentMatches: [], details: undefined };
    const html = render(stats);
    assert.ok(html.includes("No games recorded in this server."));
    assert.ok(html.includes("may not be linked"));
    assert.ok(!html.includes("Recent matches"));
    assert.ok(!html.includes("premium feature"));
    assert.ok(render(stats, { currentUserId: fixture.userId }).includes("You have no recorded games here yet"));
});

test("the sample details parse as a valid document", () => {
    assert.doesNotThrow(() => parseUserStats({ ...fixture, details: sampleDetails(1758650000) }));
});
