const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
}).outputText, filename);
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { canManageGuild } = require("../types/Guild.ts");

test("owner, Administrator, or Manage Server can manage; other permissions cannot", () => {
    assert.equal(canManageGuild({ owner: true, permissions: "0" }), true);
    assert.equal(canManageGuild({ owner: false, permissions: "8" }), true);
    // Manage Server (0x20) is enough on its own, matching the Go WriteSettings rule.
    assert.equal(canManageGuild({ owner: false, permissions: "32" }), true);
    // Either bit plus unrelated high bits (bit 46 and above exceed 2^53 territory when combined).
    assert.equal(canManageGuild({ owner: false, permissions: String((1n << 50n) | 8n) }), true);
    assert.equal(canManageGuild({ owner: false, permissions: String((1n << 50n) | 32n) }), true);
    // Neighbouring management bits (Manage Channels 0x10, Manage Roles 1<<28) are not.
    assert.equal(canManageGuild({ owner: false, permissions: String(16n | (1n << 28n)) }), false);
    assert.equal(canManageGuild({ owner: false, permissions: "0" }), false);
    // Every bit except the two, above Number.MAX_SAFE_INTEGER, must not round into bit 3 or 5.
    assert.equal(canManageGuild({ owner: false, permissions: String(((1n << 60n) - 1n) & ~8n & ~32n) }), false);
});

test("malformed permission fields fail closed", () => {
    assert.equal(canManageGuild({ owner: false, permissions: "abc" }), false);
    assert.equal(canManageGuild({ owner: false, permissions: "" }), false);
    assert.equal(canManageGuild({ owner: "true", permissions: "0" }), false);
    assert.equal(canManageGuild({ owner: false, permissions: 8 }), false);
});
