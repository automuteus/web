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
const { default: ResetPanel } = require("../components/layout/ResetPanel.tsx");

test("a reset starts as one explained button, with the destructive step not yet shown", () => {
    const html = renderToStaticMarkup(React.createElement(ResetPanel, {
        title: "Reset server stats", action: "Reset server stats", typed: "reset", url: "/api/guild/stats/reset?guildID=1",
        confirm: "Every game will be deleted.", onReset: () => undefined,
    }, React.createElement("p", null, "Delete every game <b>")));
    assert.ok(html.includes('aria-label="Reset server stats"'));
    assert.ok(html.includes("Reset server stats...</button>"));
    assert.ok(html.includes("Delete every game &lt;b&gt;"));
    assert.ok(!html.includes("Every game will be deleted."));
    assert.ok(!html.includes("<input"));
    assert.ok(!html.includes("undone"));
});

test("a disabled reset cannot be opened", () => {
    const html = renderToStaticMarkup(React.createElement(ResetPanel, {
        title: "Reset your stats", action: "Reset my stats", url: "/x", confirm: "", disabled: true, onReset: () => undefined,
    }));
    assert.ok(/<button[^>]*disabled=""[^>]*>Reset my stats\.\.\.<\/button>/.test(html));
});
