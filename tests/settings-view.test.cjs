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
const { default: SettingsView, retention } = require("../components/settings/SettingsView.tsx");
const fixture = require("./fixtures/guild-settings.json");

test("Go settings fixture displays voice rules, delays, and summary channel", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture }));
    for (const value of ["Voice rules", "Muted", "Unmuted", "Deafened", "Undeafened", "3 s", "7 s", "N/A", "Behind a spoiler", "Delete after 5 minutes", "456789012345678901", "Enabled"]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes("Not available"));
    // Leaderboard options and bot admin user IDs are being retired and must not be surfaced, even when the API
    // still returns them. Operator role IDs stay.
    for (const retired of ["Leaderboard", "leaderboard", "Bot access", "Bot admin user IDs", "123456789012345678"]) {
        assert.ok(!html.includes(retired), `Retired setting shown: ${retired}`);
    }
    for (const kept of ["Bot operators", "Operator role IDs", "234567890123456789, 345678901234567890", "start, pause, end, link, and unlink games", "can no longer control games", "members with the Administrator permission always can"]) {
        assert.ok(html.includes(kept), `Missing ${kept}`);
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
    const editing = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...fixture, language: "xx" }, onChange: () => undefined }));
    assert.ok(editing.includes('<option value="xx" selected="">xx</option>'));
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

test("defaults mark custom values per row, per cell, and per card; premium-only settings are badged", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture, defaults }));
    // 9 rows differ (language, map, room code, auto refresh, retention, channel, unmute dead, mute spectators,
    // operator roles), plus one voice cell (discussion/dead hearing) and one delay cell (lobby to tasks).
    assert.equal(count(html, "Custom"), 11);
    assert.ok(html.includes("default is None configured."));
    assert.equal(count(html, "Premium"), 5);
    for (const value of ["4 custom", "2 custom", "3 custom", "1 custom", "default is \u{1F1FA}\u{1F1F8} English.", "default is Simple.", "default is 7 s.",
        "default is Always visible.", "default is Delete immediately.", "default is None configured.", "default is Disabled.", "default is muted and undeafened."]) {
        assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes("default is true"));
    assert.ok(!html.includes("default is 0."));
});

test("a guild on the defaults shows premium badges but nothing custom", () => {
    for (const settings of [defaults, JSON.parse(JSON.stringify(defaults))]) {
        const html = renderToStaticMarkup(React.createElement(SettingsView, { settings, defaults }));
        assert.equal(count(html, "Custom"), 0);
        assert.ok(!html.includes("custom<"));
        assert.equal(count(html, "Premium"), 5);
    }
});

test("without defaults or with unavailable values nothing is marked as custom", () => {
    let html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture }));
    assert.equal(count(html, "Custom"), 0);
    assert.equal(count(html, "Premium"), 5);
    html = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...defaults, language: 5, delays: null, voiceRules: [] }, defaults }));
    assert.equal(count(html, "Custom"), 0);
    assert.ok(html.includes("Not available"));
});

test("editing renders controls for editable fields, locks the rest, and highlights errors", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, {
        settings: fixture, defaults, onChange: () => undefined, premiumLocked: true,
        errors: { "delays.delays.LOBBY.TASKS": "must be a whole number of seconds from 0 to 10", mapVersion: "must be simple or detailed" },
    }));
    assert.equal((html.match(/aria-pressed=/g) || []).length, 12, "two toggles per voice cell");
    assert.equal((html.match(/type="number"/g) || []).length, 6 + 1, "six delay boxes plus summary minutes");
    assert.equal((html.match(/role="switch"/g) || []).length, 3);
    assert.ok(html.includes("Map style"));
    assert.ok(html.includes('<option value="detailed" selected="">Detailed</option>'));
    assert.ok(html.includes('<option value="spoiler" selected="">Behind a spoiler</option>'));
    assert.ok(html.includes('<option value="after" selected="">Delete after...</option>'));
    assert.ok(html.includes('value="5"'), "summary minutes prefilled");
    assert.ok(!html.includes("be changed here yet"));
    assert.ok(html.includes('aria-label="Bot language"'));
    assert.ok(html.includes('aria-label="Summary channel ID"'));
    assert.ok(html.includes('value="456789012345678901"'));
    assert.ok(html.includes(">Clear</button>"));
    assert.ok(html.includes("Copy Channel ID"), "help for finding an ID");
    assert.ok(html.includes('<option value="de" selected="">\u{1F1E9}\u{1F1EA} German (Deutsch)</option>'));
    assert.ok(html.includes('<option value="en">\u{1F1FA}\u{1F1F8} English</option>'));
    assert.equal((html.match(/<option value="[a-z]{2}"/g) || []).length, 14);
    // Premium lock disables premium-only controls and says why.
    assert.ok((html.match(/Requires premium to change/g) || []).length >= 4);
    assert.match(html, /<input[^>]*disabled=""[^>]*aria-label="Mute spectators"/);
    assert.doesNotMatch(html, /<input[^>]*disabled=""[^>]*aria-label="Unmute dead players during tasks"/);
    // Errors land on the named control and the row.
    assert.ok(html.includes("must be a whole number of seconds from 0 to 10"));
    assert.ok(html.includes("must be simple or detailed"));
    assert.equal((html.match(/role="alert"/g) || []).length, 2);
    // Still marks custom values while editing.
    assert.equal(count(html, "Custom"), 11);
    // Role chips with remove buttons, plus a box to add one.
    assert.equal((html.match(/aria-label="Remove role /g) || []).length, 2);
    assert.ok(html.includes('aria-label="Role ID to add"'));
    assert.ok(html.includes("Copy Role ID"));
});

test("without premium lock every editable control is enabled and toggles carry their context", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: defaults, onChange: () => undefined }));
    assert.equal((html.match(/disabled=""/g) || []).length, 2, "only Clear and Add are disabled, since nothing is typed");
    assert.match(html, /disabled=""[^>]*>Clear<\/button>/);
    assert.match(html, /disabled=""[^>]*>Add<\/button>/);
    assert.ok(html.includes('aria-label="Alive players during tasks: muted"'));
    assert.ok(html.includes('aria-label="Dead players during discussion: undeafened"'));
    assert.ok(html.includes('aria-label="Delay from lobby to tasks in seconds"'));
    assert.ok(!html.includes("Requires premium"));
    const saving = renderToStaticMarkup(React.createElement(SettingsView, { settings: defaults, onChange: () => undefined, disabled: true }));
    assert.equal((saving.match(/disabled=""/g) || []).length, 12 + 6 + 3 + 3 + 1 + 2 + 2, "every control disabled while saving");
});

const { setVoiceRule, setDelay } = require("../components/settings/settings-edit.ts");

test("unsaved edits are highlighted apart from custom values and tallied per card", () => {
    const draft = { ...setDelay(setVoiceRule(defaults, "MuteRules", "LOBBY", "alive", true), "LOBBY", "TASKS", 3), autoRefresh: true };
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: draft, saved: defaults, defaults, onChange: () => undefined }));
    assert.equal((html.match(/class="dirty"/g) || []).length, 1, "the auto refresh row");
    assert.equal((html.match(/dirtyCell/g) || []).length, 2, "one voice cell and one delay cell");
    assert.equal((html.match(/1 unsaved/g) || []).length, 3, "voice, delays, and display cards");
    assert.equal(count(html, "Custom"), 3, "all three edits also differ from the defaults");
    assert.ok(html.includes("1 custom"));
    assert.ok(html.includes("·"));

    // Editing back to the default clears "custom" but the edit is still unsaved.
    const reverted = { ...fixture, mapVersion: "simple" };
    const back = renderToStaticMarkup(React.createElement(SettingsView, { settings: reverted, saved: fixture, defaults, onChange: () => undefined }));
    assert.equal(count(back, "Custom"), 10);
    assert.equal((back.match(/class="dirty"/g) || []).length, 1);
    assert.ok(back.includes("3 custom") && back.includes("1 unsaved"));

    // No saved document, or a saved document equal to the draft, means nothing is dirty.
    for (const props of [{ settings: draft, defaults }, { settings: draft, saved: draft, defaults }]) {
        const clean = renderToStaticMarkup(React.createElement(SettingsView, { ...props, onChange: () => undefined }));
        assert.ok(!clean.includes("dirty"));
        assert.ok(!clean.includes("unsaved"));
    }
});

test("summary channel shows the live check for a newly typed ID and nothing stale", () => {
    const typed = { ...defaults, matchSummaryChannelID: "223456789012345678" };
    const render = (channelCheck) => renderToStaticMarkup(React.createElement(SettingsView, { settings: typed, saved: defaults, onChange: () => undefined, channelCheck }));
    assert.ok(render(undefined).includes("Copy Channel ID"));
    assert.ok(render({ id: "223456789012345678", state: "checking" }).includes("Checking that the bot can post"));
    const ok = render({ id: "223456789012345678", state: "ok", name: "match-summaries" });
    assert.ok(ok.includes("#match-summaries: the bot can post match summaries here."));
    assert.ok(ok.includes('role="status"'));
    const bad = render({ id: "223456789012345678", state: "problem", problems: ["the bot is missing the Send Messages permission in this channel"] });
    assert.ok(bad.includes("missing the Send Messages permission"));
    assert.ok(bad.includes('role="alert"'));
    assert.ok(render({ id: "223456789012345678", state: "unavailable" }).includes("verified when you save"));
    // A check for a different ID is ignored, and the saved value is never re-checked.
    assert.ok(!render({ id: "999999999999999999", state: "ok", name: "other" }).includes("#other"));
    const unchanged = renderToStaticMarkup(React.createElement(SettingsView, { settings: typed, saved: typed, onChange: () => undefined, channelCheck: { id: "223456789012345678", state: "ok", name: "x" } }));
    assert.ok(!unchanged.includes("#x:") && unchanged.includes("Copy Channel ID"));
    // Escaped, never injected.
    assert.ok(!render({ id: "223456789012345678", state: "problem", problems: ["<img src=x>"] }).includes("<img"));
});

test("an indexed role error lands on the row and marks the offending chip", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture, onChange: () => undefined, errors: { "permissionRoleIDs[1]": "is not a Discord role ID" } }));
    assert.ok(html.includes("is not a Discord role ID"));
    assert.equal((html.match(/chipError/g) || []).length, 1);
    assert.match(html, /chipError[^>]*><code>345678901234567890<\/code>/);
});

const guildRoles = [
    { id: "234567890123456789", name: "Mods", color: 16711680, position: 3, managed: false },
    { id: "999999999999999999", name: "Helper", color: 0, position: 2, managed: false },
    { id: "888888888888888888", name: "AutoMuteUs", color: 5793266, position: 1, managed: true },
];

test("operator roles show names and colours, flag unknown IDs, and offer a picker of the rest", () => {
    const html = renderToStaticMarkup(React.createElement(SettingsView, { settings: fixture, saved: fixture, onChange: () => undefined, roles: guildRoles }));
    assert.ok(html.includes("Operator roles"));
    assert.ok(html.includes("background:#ff0000"), "Mods swatch");
    assert.ok(html.includes("<span>Mods</span>"));
    assert.ok(html.includes('aria-label="Remove role Mods"'));
    // 345678901234567890 is in the fixture but not a guild role: dashed chip, raw ID, and a blocking message.
    assert.ok(html.includes("chipUnknown"));
    assert.ok(html.includes("<code>345678901234567890</code>"));
    assert.ok(html.includes("Not a role in this server: 345678901234567890. Remove it to save."));
    // The picker lists only roles not yet added, marks managed ones, and replaces the raw ID box.
    assert.ok(html.includes('aria-label="Role to add"'));
    assert.ok(!html.includes('aria-label="Role ID to add"'));
    assert.ok(html.includes('<option value="999999999999999999">Helper</option>'));
    assert.ok(html.includes('<option value="888888888888888888">AutoMuteUs (bot or integration)</option>'));
    assert.ok(!html.includes('<option value="234567890123456789">'));
    assert.ok(!html.includes("Copy Role ID"));

    // Read-only view uses names too, and an uncoloured role gets the default swatch.
    const readOnly = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...fixture, permissionRoleIDs: ["999999999999999999", "234567890123456789"] }, roles: guildRoles }));
    assert.ok(readOnly.includes("Helper, Mods"));
    const helper = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...fixture, permissionRoleIDs: ["999999999999999999"] }, onChange: () => undefined, roles: guildRoles }));
    assert.ok(helper.includes("background:#99aab5"));
    assert.ok(!helper.includes("Not a role in this server"));
    // Every role listed: the picker says so and is disabled.
    const full = renderToStaticMarkup(React.createElement(SettingsView, { settings: { ...fixture, permissionRoleIDs: guildRoles.map((r) => r.id) }, onChange: () => undefined, roles: guildRoles }));
    assert.ok(full.includes("Every role is already listed"));
});
