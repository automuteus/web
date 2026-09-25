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
const { default: i18n, uiLanguage } = require("../utils/i18n.ts");
const { default: UserStatsView } = require("../components/stats/UserStatsView.tsx");
const fixture = require("./fixtures/user-stats.json");
const en = require("../locales/en/stats.json");

test("Discord locales map to a bot language, keeping the region, and anything else is English", () => {
    for (const [locale, want] of [["ja", "ja"], ["pt-BR", "pt-BR"], ["zh-TW", "zh-TW"], ["es-ES", "es-ES"], ["sv-SE", "sv-SE"], ["ko", "en"], ["en-GB", "en-GB"], ["", "en"], [undefined, "en"], [42, "en"]]) {
        assert.equal(uiLanguage(locale), want, String(locale));
    }
});

test("counts use the language's plural forms and number format, with English for missing keys", async (t) => {
    i18n.addResourceBundle("pl", "stats", { user: { summary: { wins_one: "{{count, number}} wygrana", wins_few: "{{count, number}} wygrane", wins_many: "{{count, number}} wygranych" } } });
    t.after(() => i18n.removeResourceBundle("pl", "stats"));
    const wins = (count) => i18n.t("user.summary.wins", { lng: "pl", count });
    assert.deepEqual([1, 3, 5, 22, 1234].map(wins), ["1 wygrana", "3 wygrane", "5 wygranych", "22 wygrane", "1234 wygrane"]);
    assert.equal(i18n.t("user.recent.title", { lng: "pl" }), en.user.recent.title);
    assert.equal(i18n.t("shared.games", { lng: "de-DE", count: 12345 }), "12.345 games");
});

test("the view renders in the active language, and no key is shown raw", async (t) => {
    i18n.addResourceBundle("ja", "stats", { user: { recent: { title: "最近の試合" }, hero: { since: "<first>{{first}}</first>から参加 · 最終 <last>{{last}}</last>" } } });
    t.after(async () => { i18n.removeResourceBundle("ja", "stats"); await i18n.changeLanguage("en"); });
    await i18n.changeLanguage("ja");
    const html = renderToStaticMarkup(React.createElement(UserStatsView, { stats: fixture }));
    assert.ok(html.includes(">最近の試合<"));
    assert.match(html, /<time dateTime="[^"]+">2025\/09\/0\d<\/time>から参加/);
    assert.doesNotMatch(html, /(user|shared)\.[a-z]+\.[a-zA-Z]/);
});
