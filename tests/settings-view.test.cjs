const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".tsx"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
}).outputText, filename);
require.extensions[".css"] = (module) => { module.exports = new Proxy({}, { get: (_, key) => key === "__esModule" ? false : key }); };
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { default: SettingsView, retention } = require("../components/settings/SettingsView.tsx");
const fixture = require("./fixtures/guild-settings.json");

test("Go settings fixture displays voice rules, delays, and summary channel", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture }));
    for (const value of ["Voice rules", "Muted", "Unmuted", "Deafened", "Undeafened", "3 s", "7 s", "N/A", "Behind a spoiler", "Delete after 5 minutes", "456789012345678901", "Enabled"]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes("Not available"));
    // Leaderboard options and bot admin/operator IDs are being retired and must not be surfaced, even when the
    // API still returns them.
    for (const retired of ["Leaderboard", "leaderboard", "Bot access", "admin user", "Operator role", "234567890123456789", "123456789012345678", "345678901234567890"]) {
        assert.ok(!html.includes(retired), `Retired setting shown: ${retired}`);
    }
    assert.equal((html.match(/AutoMuteUs server-/g) || []).length, 0);
    assert.ok(!html.includes("<input"));
    assert.ok(!html.includes("<button"));
    assert.ok(html.includes("music bots"));
    assert.ok(html.includes("additional Discord voice requests"));
    assert.ok(!html.includes("Potentially unsafe combination"));
});

test("summary sentinel values and missing settings are not presented as defaults", () => {
    assert.equal(retention(-1), "Keep forever");
    assert.equal(retention(0), "Delete immediately");
    assert.equal(retention(1), "Delete after 1 minute");
    assert.equal(retention(undefined), "Not available");
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: {} }));
    assert.ok(html.includes("Not available"));
    assert.ok(!html.includes("Unmuted"));
    assert.ok(!html.includes("Undeafened"));
    assert.ok(!html.includes("0 s"));
    assert.ok(!html.includes("Disabled"));
});

test("untrusted strings are escaped and malformed fields cannot crash the view", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: {
        ...fixture, language: "<script>alert(1)</script>", adminIDs: [{ malicious: true }], leaderboardSize: { malicious: true },
        voiceRules: [], delays: null, mapVersion: { malicious: true }, displayRoomCode: "__proto__",
    } }));
    assert.ok(!html.includes("<script>"));
    assert.ok(html.includes("&lt;script&gt;"));
    assert.ok(html.includes("Not available"));
});

test("unsafe task voice combination is called out", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: {
        ...fixture,
        unmuteDeadDuringTasks: true,
        voiceRules: {
            ...fixture.voiceRules,
            DeafRules: { ...fixture.voiceRules.DeafRules, TASKS: { alive: false, dead: false } },
        },
    } }));
    assert.ok(html.includes("Potentially unsafe combination"));
    assert.ok(html.includes("tell alive players who the impostors are"));
});

const defaults = require("./fixtures/guild-settings-defaults.json");
function count(html, marker) { return (html.match(new RegExp(`aria-label="${marker}\\. `, "g")) || []).length; }

test("defaults mark customised values per row, per cell, and per card; premium-only settings are badged", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture, defaults }));
    // 8 rows differ (language, map, room code, auto refresh, retention, channel, unmute dead, mute spectators),
    // plus one voice cell (discussion/dead hearing) and one delay cell (lobby to tasks).
    assert.equal(count(html, "Changed"), 10);
    assert.equal(count(html, "Premium"), 5);
    for (const value of ["4 changed", "2 changed", "3 changed", "1 changed", "default of en.", "default of simple.", "default of 7 s.",
        "default of Always visible.", "default of Delete immediately.", "default of None configured.", "default of Disabled.", "default of muted and undeafened."]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes("default of true"));
    assert.ok(!html.includes("default of 0."));
});

test("a guild on the defaults shows premium badges but nothing changed", () => {
    for (const settings of [defaults, JSON.parse(JSON.stringify(defaults))]) {
        const html = renderToStaticMarkup(React.createElement(SettingsView, { settings, defaults }));
        assert.equal(count(html, "Changed"), 0);
        assert.ok(!html.includes("changed<"));
        assert.equal(count(html, "Premium"), 5);
    }
});

test("without defaults or with unavailable values nothing is marked as changed", () => {
    let html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture }));
    assert.equal(count(html, "Changed"), 0);
    assert.equal(count(html, "Premium"), 5);
    html = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...defaults, language: 5, delays: null, voiceRules: [] }, defaults }));
    assert.equal(count(html, "Changed"), 0);
    assert.ok(html.includes("Not available"));
});
