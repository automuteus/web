const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
}).outputText, filename);
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { EDITABLE, LANGUAGES, addRoleID, removeRoleID, roleColor, unknownRoleIDs, patchBody, countChanges, validateDraft, setVoiceRule, setDelay, setField, errorMap, same } = require("../components/settings/settings-edit.ts");
const defaults = require("./fixtures/guild-settings-defaults.json");
const fixture = require("./fixtures/guild-settings.json");

test("editable list excludes admin user IDs and leaderboard options", () => {
    assert.ok(EDITABLE.includes("language") && EDITABLE.includes("matchSummaryChannelID") && EDITABLE.includes("permissionRoleIDs"));
    for (const locked of ["adminIDs", "leaderboardMention", "leaderboardSize", "leaderboardMin"]) {
        assert.ok(!EDITABLE.includes(locked), `${locked} must not be editable`);
    }
});

test("setters return new documents and never mutate the original", () => {
    const frozen = JSON.parse(JSON.stringify(defaults));
    const a = setVoiceRule(defaults, "DeafRules", "TASKS", "dead", true);
    const b = setDelay(a, "LOBBY", "TASKS", 3);
    const c = setField(b, "mapVersion", "detailed");
    assert.deepEqual(defaults, frozen);
    assert.equal(a.voiceRules.DeafRules.TASKS.dead, true);
    assert.equal(a.voiceRules.DeafRules.TASKS.alive, defaults.voiceRules.DeafRules.TASKS.alive);
    assert.equal(a.voiceRules.MuteRules, defaults.voiceRules.MuteRules, "untouched table is shared, not copied");
    assert.equal(b.delays.delays.LOBBY.TASKS, 3);
    assert.equal(b.delays.delays.TASKS.LOBBY, defaults.delays.delays.TASKS.LOBBY);
    assert.equal(c.mapVersion, "detailed");
    // Malformed tables are rebuilt rather than crashing.
    const rebuilt = setVoiceRule({ voiceRules: [] }, "MuteRules", "LOBBY", "alive", true);
    assert.deepEqual(rebuilt.voiceRules, { MuteRules: { LOBBY: { alive: true } } });
    assert.deepEqual(setDelay({ delays: null }, "LOBBY", "TASKS", 2).delays, { delays: { LOBBY: { TASKS: 2 } } });
});

test("patch body carries only changed editable fields, with whole voice and delay documents", () => {
    assert.deepEqual(patchBody(defaults, defaults), {});
    assert.deepEqual(patchBody(defaults, JSON.parse(JSON.stringify(defaults))), {});
    const draft = setField(setDelay(setVoiceRule(defaults, "MuteRules", "LOBBY", "alive", true), "TASKS", "LOBBY", 4), "autoRefresh", true);
    const body = patchBody(defaults, draft);
    assert.deepEqual(Object.keys(body).sort(), ["autoRefresh", "delays", "voiceRules"]);
    assert.deepEqual(body.voiceRules, draft.voiceRules);
    assert.deepEqual(body.delays, draft.delays);
    assert.equal(body.autoRefresh, true);
    // Edits to locked fields are dropped from the body even if something put them in the draft.
    assert.deepEqual(patchBody(defaults, { ...defaults, language: "de", matchSummaryChannelID: "123456789012345678", adminIDs: ["1"] }), { language: "de", matchSummaryChannelID: "123456789012345678" });
});

test("change count is per cell and only counts editable fields", () => {
    assert.equal(countChanges(defaults, defaults), 0);
    assert.equal(countChanges(defaults, setVoiceRule(defaults, "MuteRules", "LOBBY", "alive", true)), 1);
    assert.equal(countChanges(defaults, setVoiceRule(setVoiceRule(defaults, "MuteRules", "LOBBY", "alive", true), "DeafRules", "LOBBY", "alive", true)), 2);
    assert.equal(countChanges(defaults, fixture), 11);
});

test("validation mirrors the API ranges and names fields the same way", () => {
    assert.deepEqual(validateDraft(defaults), []);
    assert.deepEqual(validateDraft(fixture), []);
    const bad = setField(setField(setDelay(setDelay(defaults, "LOBBY", "TASKS", 11), "TASKS", "LOBBY", NaN), "mapVersion", "3d"), "deleteGameSummary", 61);
    const errors = validateDraft(bad);
    assert.deepEqual(errors.map((e) => e.field), ["delays.delays.LOBBY.TASKS", "delays.delays.TASKS.LOBBY", "mapVersion", "deleteGameSummary"]);
    assert.deepEqual(validateDraft({ ...defaults, deleteGameSummary: -1 }), []);
    assert.deepEqual(validateDraft({ ...defaults, deleteGameSummary: 2.5 }).map((e) => e.field), ["deleteGameSummary"]);
    assert.deepEqual(validateDraft({ ...defaults, displayRoomCode: "sometimes", autoRefresh: "yes" }).map((e) => e.field), ["displayRoomCode", "autoRefresh"]);
    assert.deepEqual(validateDraft(setVoiceRule(defaults, "DeafRules", "TASKS", "dead", "true")).map((e) => e.field), ["voiceRules.DeafRules.TASKS.dead"]);
    // A partial body validates only what it carries, and a locked key is refused.
    assert.deepEqual(validateDraft({ autoRefresh: true }, ["autoRefresh"]), []);
    assert.deepEqual(validateDraft({ language: "de" }, ["language"]), []);
    assert.match(validateDraft({ language: "xx" }, ["language"])[0].message, /installed languages: en, de/);
    assert.deepEqual(validateDraft({ adminIDs: [] }, ["adminIDs"]).map((e) => e.message), ["cannot be changed here"]);
    for (const good of ["", "12345678901234567", "12345678901234567890"]) assert.deepEqual(validateDraft({ matchSummaryChannelID: good }, ["matchSummaryChannelID"]), [], good);
    for (const bad of ["1", "general", "<#123456789012345678>", " 123456789012345678", 123456789012345678, null]) {
        assert.equal(validateDraft({ matchSummaryChannelID: bad }, ["matchSummaryChannelID"]).length, 1, String(bad));
    }
    assert.equal(LANGUAGES.length, 14);
    assert.ok(LANGUAGES.every((l) => /^[a-z]{2}$/.test(l.code) && [...l.flag].length === 2 && l.name && l.native));
    assert.equal(new Set(LANGUAGES.map((l) => l.code)).size, 14);
    const map = errorMap(errors);
    assert.equal(Object.keys(map).length, 4);
    assert.match(map["delays.delays.LOBBY.TASKS"], /0 to 10/);
});

test("structural equality ignores key order and rejects shape mismatches", () => {
    assert.ok(same({ a: 1, b: { c: [1, 2] } }, { b: { c: [1, 2] }, a: 1 }));
    assert.ok(!same({ a: 1 }, { a: 1, b: 2 }));
    assert.ok(!same([1], { 0: 1 }));
    assert.ok(!same(null, {}));
});

test("operator role IDs: add and remove without duplicates, validated like the API", () => {
    const one = addRoleID(defaults, "234567890123456789");
    assert.deepEqual(one.permissionRoleIDs, ["234567890123456789"]);
    assert.equal(addRoleID(one, "234567890123456789"), one, "duplicate add is a no-op");
    const two = addRoleID(one, "345678901234567890");
    assert.deepEqual(removeRoleID(two, "234567890123456789").permissionRoleIDs, ["345678901234567890"]);
    assert.deepEqual(defaults.permissionRoleIDs, [], "original untouched");
    assert.deepEqual(addRoleID({ permissionRoleIDs: "junk" }, "234567890123456789").permissionRoleIDs, ["234567890123456789"]);

    assert.deepEqual(validateDraft(two, ["permissionRoleIDs"]), []);
    assert.deepEqual(validateDraft({ permissionRoleIDs: ["234567890123456789", "x", "234567890123456789"] }, ["permissionRoleIDs"]).map((e) => e.field), ["permissionRoleIDs[1]", "permissionRoleIDs[2]"]);
    assert.deepEqual(validateDraft({ permissionRoleIDs: "x" }, ["permissionRoleIDs"]).map((e) => e.field), ["permissionRoleIDs"]);
    const many = Array.from({ length: 101 }, (_, i) => String(100000000000000000 + i));
    assert.match(validateDraft({ permissionRoleIDs: many }, ["permissionRoleIDs"])[0].message, /at most 100/);
    assert.deepEqual(patchBody(defaults, two), { permissionRoleIDs: ["234567890123456789", "345678901234567890"] });
});

test("role colours and unknown-ID detection", () => {
    assert.equal(roleColor({ color: 0 }), "#99aab5");
    assert.equal(roleColor({ color: 16711680 }), "#ff0000");
    assert.equal(roleColor({ color: 255 }), "#0000ff");
    const roles = [{ id: "234567890123456789", name: "Mods", color: 0, position: 1, managed: false }];
    assert.deepEqual(unknownRoleIDs(["234567890123456789", "345678901234567890"], roles), ["345678901234567890"]);
    assert.deepEqual(unknownRoleIDs(["345678901234567890"], undefined), [], "unknown list means no judgement");
    assert.deepEqual(unknownRoleIDs("junk", roles), []);
});
