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
const { COLORS, parseMatchSummary, previewFree, matchNumber, clock, duration, timelineSections } = require("../components/stats/match-summary.ts");
const { default: MatchSummaryView } = require("../components/stats/MatchSummaryView.tsx");
const fixture = require("./fixtures/match-summary.json");

function render(match, props = {}) {
    return renderToStaticMarkup(React.createElement(MatchSummaryView, { match, ...props }));
}

test("Go match fixture parses to the same document, with unknown fields dropped", () => {
    const noisy = { ...fixture, connectCode: "ABCDEFGH", extra: 1, roster: fixture.roster.map((p) => ({ ...p, extra: true })),
        timeline: { ...fixture.timeline, extra: [], events: fixture.timeline.events.map((e) => ({ ...e, payload: "x" })) } };
    assert.deepEqual(parseMatchSummary(noisy), fixture);
    assert.ok(!("connectCode" in parseMatchSummary(noisy)));
});

test("free and in-progress documents omit what the API omits", () => {
    const { timeline, endTime, result, winner, map, region, ...rest } = fixture;
    const parsed = parseMatchSummary({ ...rest, status: "inProgress", roster: [], rosterComplete: false, players: undefined });
    assert.equal(parsed.timeline, undefined);
    assert.equal(parsed.endTime, undefined);
    assert.equal(parsed.result, undefined);
    assert.equal(parsed.winner, undefined);
    assert.equal(parsed.map, undefined);
    assert.deepEqual(parsed.players, {});
});

test("values a newer API might add are dropped, not fatal", () => {
    const parsed = parseMatchSummary({ ...fixture, map: "newmap", region: "oc", result: "somethingNew",
        roster: [{ ...fixture.roster[0], color: "fuchsia" }],
        timeline: { ...fixture.timeline, events: [{ offset: 1, type: "vented", name: "Bo" }, ...fixture.timeline.events] } });
    assert.equal(parsed.map, undefined);
    assert.equal(parsed.region, undefined);
    assert.equal(parsed.result, "unknown");
    assert.equal(parsed.roster[0].color, "");
    assert.deepEqual(parsed.timeline.events, fixture.timeline.events);
});

test("malformed documents are rejected rather than partially accepted", () => {
    const bad = [
        { ...fixture, guildId: "abc" },
        { ...fixture, matchId: 42 },
        { ...fixture, matchId: "042" },
        { ...fixture, status: "done" },
        { ...fixture, startTime: "1758600000" },
        { ...fixture, endTime: -1 },
        { ...fixture, winner: "nobody" },
        { ...fixture, roster: undefined },
        { ...fixture, rosterComplete: "yes" },
        { ...fixture, roster: [{ ...fixture.roster[0], role: "ghost" }] },
        { ...fixture, roster: [{ ...fixture.roster[0], won: 1 }] },
        { ...fixture, roster: [{ ...fixture.roster[0], name: 5 }] },
        { ...fixture, roster: [{ ...fixture.roster[0], userId: "<script>" }] },
        { ...fixture, timeline: { ...fixture.timeline, events: undefined } },
        { ...fixture, timeline: { ...fixture.timeline, deaths: NaN } },
        { ...fixture, timeline: { ...fixture.timeline, events: [{ offset: "1", type: "death" }] } },
        { ...fixture, timeline: { ...fixture.timeline, events: [{ offset: 1, type: "death", userId: "1" }] } },
        { ...fixture, premium: { tier: "3", days: 1 } },
        [],
        null,
    ];
    for (const doc of bad) assert.throws(() => parseMatchSummary(doc), /Invalid match summary/, JSON.stringify(doc));
});

test("player names are shared with the stats parser, so prototype keys and foreign avatars are dropped", () => {
    const parsed = parseMatchSummary({ ...fixture, players: { "__proto__": { username: "evil" }, "223456789012345678": { username: "a", avatar: "https://evil.example/x.png" } } });
    assert.deepEqual(Object.keys(parsed.players), ["223456789012345678"]);
    assert.deepEqual(parsed.players["223456789012345678"], { username: "a" });
});

test("pasted match IDs accept the bot's CODE:number form and the bare number", () => {
    assert.equal(matchNumber("42"), "42");
    assert.equal(matchNumber(" ABCDEFGH:42 "), "42");
    assert.equal(matchNumber("abcd1234 : 0042"), "42");
    for (const bad of ["", "0", "-1", "4 2", "ABC:42", "ABCDEFGH:", "1e3", "12345678901234567890"]) assert.equal(matchNumber(bad), "", bad);
});

test("clock and duration format offsets and lengths", () => {
    assert.equal(clock(0), "0:00");
    assert.equal(clock(65), "1:05");
    assert.equal(clock(3723), "1:02:03");
    assert.equal(duration(45), "45 s");
    assert.equal(duration(845), "14 min 5 s");
    assert.equal(duration(600), "10 min");
    assert.equal(duration(3720), "1 h 2 min");
});

test("the timeline splits into rounds and meetings, keeping a late exile with its meeting", () => {
    const sections = timelineSections(fixture.timeline.events);
    assert.deepEqual(sections.map((s) => `${s.kind}${s.number}:${s.events.map((e) => e.name).join(",")}`),
        ["round1:Al", "meeting1:Mochi", "round2:Cy,Bo", "meeting2:"]);
    // Events before any phase change get a round of their own, as seeded or older matches have them.
    assert.deepEqual(timelineSections([{ offset: 60, type: "death", name: "X" }, { offset: 90, type: "discussion" }]).map((s) => s.kind), ["round", "meeting"]);
    assert.deepEqual(timelineSections([]), []);
});

test("the premium fixture renders the header, both teams, linked names, fates, and the timeline", () => {
    const html = render(fixture);
    for (const value of ["Match 42", "Crewmates win", "Crewmates won by voting out the impostors", "The Airship", "North America", "14 min 5 s",
        "Impostors", "Crewmates", ">Won<", ">Bo<", ">bob<", ">Kiwi<", "Not linked", ">Al<", ">Mochi<", "423456789012345678",
        "Timeline", "Round 1", "Meeting 1", "Round 2", "Meeting 2", "was killed", "was voted out", "disconnected", "No one was voted out.",
        "Killed <time>0:50</time>", "Voted out <time>2:01</time>", "Disconnected <time>5:10</time>"]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    // Only the winning side is badged. The killed and voted-out lie as bodies, the disconnected player is faded,
    // survivors stand, and the one player with no reported color is an outline.
    assert.equal((html.match(/>Won</g) || []).length, 1);
    for (const src of ["cyan-dead", "lime-dead", "red-dead", "coral"]) assert.ok(html.includes(`src="/images/crewmates/${src}.png"`), src);
    assert.ok(!html.includes("/images/crewmates/coral-dead.png"));
    assert.ok(/class="crewmate gone"[^>]*title="coral"/.test(html));
    assert.ok(html.includes("noColor"));
    assert.ok(!html.includes("premium feature"));
    assert.ok(!html.includes("Only players linked"));
    assert.ok(!html.includes("lockedSprite"));
    assert.ok(!html.includes("shows who was killed or voted out"));
    assert.ok(html.includes('dateTime="2025-09-23T04:00:00.000Z"'));
    assert.ok(/referrerpolicy="no-referrer"/i.test(html));
});

test("free documents keep the roster and blur a sample timeline under a premium link", () => {
    const { timeline, ...free } = fixture;
    const html = render({ ...free, premium: { tier: 0, days: -9999 } });
    assert.ok(html.includes(">Kiwi<"));
    assert.ok(html.includes("The match timeline is a premium feature"));
    assert.ok(html.includes('href="/premium?guild=123456789012345678"'));
    assert.ok(html.includes('aria-hidden="true"'));
    // No fates without a timeline, so every real player stands; the sample names only appear inside the hidden sample.
    assert.ok(!html.includes("Killed <time>"));
    assert.ok(!html.includes("/images/crewmates/cyan-dead.png"));
    // Every real player's sprite is the standing one, blurred, with a note saying what premium adds.
    assert.equal((html.match(/lockedSprite/g) || []).length, fixture.roster.filter((p) => p.color).length);
    assert.ok(html.includes("shows who was killed or voted out, and when."));
    // The blurred sample timeline has made-up bodies of its own; the real roster before it has none.
    assert.ok(!/title="[a-z]+, dead"/.test(html.slice(0, html.indexOf("The match timeline is a premium feature"))));
    assert.ok(!html.includes(">Al</strong>"));
});

test("an incomplete roster says who is missing, and in-progress and aborted matches say so", () => {
    assert.ok(render({ ...fixture, rosterComplete: false }).includes("Only players linked to AutoMuteUs are listed"));
    const { timeline, endTime, result, winner, ...rest } = fixture;
    const live = render({ ...rest, status: "inProgress", roster: [], rosterComplete: false });
    assert.ok(live.includes("Match in progress"));
    assert.ok(live.includes("The roster appears when the match ends."));
    assert.ok(!live.includes("Length"));
    const aborted = render({ ...rest, endTime: 1758600100, status: "aborted", premium: { tier: 0, days: -9999 } });
    assert.ok(aborted.includes("Match ended early"));
    assert.ok(aborted.includes("doesn&#x27;t count toward stats"));
    assert.ok(!aborted.includes(">Won<"));
    assert.ok(!aborted.includes("premium feature"));
    const unknown = render({ ...fixture, result: "unknown", winner: undefined, roster: fixture.roster.map((p) => ({ ...p, won: false })) });
    assert.ok(unknown.includes("No winner recorded"));
    assert.ok(unknown.includes("without reporting a result"));
});

test("the signed-in user's roster row is highlighted and badged", () => {
    assert.ok(!render(fixture).includes(">You<"));
    const html = render(fixture, { currentUserId: "223456789012345678" });
    assert.equal((html.match(/>You</g) || []).length, 1);
    assert.ok(html.includes('class="me"'));
    assert.ok(!render(fixture, { currentUserId: "999456789012345678" }).includes(">You<"));
});

test("every color has a standing and a dead crewmate image", () => {
    const path = require("node:path");
    for (const color of COLORS) for (const name of [color, `${color}-dead`]) {
        assert.ok(fs.existsSync(path.join(__dirname, "../public/images/crewmates", `${name}.png`)), name);
    }
});

test("the free preview drops the timeline and premium but keeps the roster, without touching the original", () => {
    const preview = previewFree(fixture);
    assert.equal(preview.timeline, undefined);
    assert.deepEqual(preview.premium, { tier: 0, days: -9999 });
    assert.deepEqual(preview.roster, fixture.roster);
    assert.ok(fixture.timeline);
    const html = render(preview);
    assert.ok(html.includes("The match timeline is a premium feature"));
    assert.ok(html.includes(">Kiwi<"));
});

test("a linked player's fate follows their user ID even when the event's name or color differs", () => {
    const events = [{ offset: 5, type: "tasks" }, { offset: 60, type: "death", name: "whitewalker", color: "green", userId: "223456789012345678" }];
    const html = render({ ...fixture, timeline: { ...fixture.timeline, events } });
    assert.ok(html.includes("Killed <time>1:00</time>"));
    assert.ok(html.includes("/images/crewmates/cyan-dead.png"));
    // Unlinked players still need both name and color to match.
    assert.ok(!html.includes("/images/crewmates/lime-dead.png"));
});

test("linked roster players link to their player page in the match's server", () => {
    const html = render(fixture);
    assert.ok(html.includes('href="/stats/user?guild=123456789012345678&amp;user=323456789012345678"'));
    assert.ok(render(fixture, { preview: true }).includes("user=323456789012345678&amp;preview=free"));
});
