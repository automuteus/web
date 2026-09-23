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

test("Go settings fixture displays voice rules, delays, and configured IDs", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture }));
    for (const value of ["Voice rules", "Muted", "Unmuted", "Deafened", "Undeafened", "3 s", "7 s", "N/A", "Behind a spoiler", "Delete after 5 minutes", "456789012345678901", "234567890123456789", "Disabled", "Enabled"]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes("Not available"));
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
        ...fixture, language: "<script>alert(1)</script>", adminIDs: [{ malicious: true }],
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
