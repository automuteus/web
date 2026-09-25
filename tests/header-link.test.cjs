const fs = require("node:fs");
const ts = require("typescript");
for (const ext of [".ts", ".tsx"]) {
    require.extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
        fileName: filename,
    }).outputText, filename);
}
const { test } = require("node:test");
const assert = require("node:assert/strict");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// The link reads the current address through useRouter; stand in for it outside Next.
let current = { pathname: "/", query: {} };
require.cache[require.resolve("next/router")] = { exports: { useRouter: () => current } };
const { default: HeaderLink } = require("../components/layout/HeaderLink.tsx");

function href(link, keepGuild, route) {
    current = route;
    const html = renderToStaticMarkup(React.createElement(HeaderLink, { text: "x", link, keepGuild }));
    return /href="([^"]*)"/.exec(html)[1].replace(/&amp;/g, "&");
}

test("per-server links keep the selected server; other links and bad IDs don't", () => {
    const guild = "123456789012345678";
    assert.equal(href("/stats", true, { pathname: "/settings", query: { guild } }), `/stats?guild=${guild}`);
    assert.equal(href("/settings", true, { pathname: "/stats/user", query: { guild, user: "223456789012345678", preview: "free" } }), `/settings?guild=${guild}`);
    assert.equal(href("/commands", false, { pathname: "/stats", query: { guild } }), "/commands");
    assert.equal(href("/stats", true, { pathname: "/settings", query: {} }), "/stats");
    for (const bad of ["abc", "42", ["1", "2"], `${guild}/../x`]) {
        assert.equal(href("/stats", true, { pathname: "/settings", query: { guild: bad } }), "/stats", String(bad));
    }
});
