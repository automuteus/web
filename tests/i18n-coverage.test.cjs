const fs = require("node:fs");
const path = require("node:path");
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
const { default: i18n } = require("../utils/i18n.ts");
const { default: GuildStatsView } = require("../components/stats/GuildStatsView.tsx");
const { default: MatchSummaryView } = require("../components/stats/MatchSummaryView.tsx");
const { default: UserStatsView } = require("../components/stats/UserStatsView.tsx");
const { default: SettingsView } = require("../components/settings/SettingsView.tsx");
const { parseGuildStats } = require("../components/stats/guild-stats.ts");
const { parseMatchSummary } = require("../components/stats/match-summary.ts");

const LOCALES = path.join(__dirname, "../locales/en");
const catalogs = Object.fromEntries(fs.readdirSync(LOCALES).map((file) => [file.replace(/\.json$/, ""), require(path.join(LOCALES, file))]));

/** Every English value wrapped in ⟦…⟧, loaded under a supported language in place of its own catalog. */
const PSEUDO = "it";
const wrap = (value) => typeof value === "string" ? `⟦${value}⟧` : Object.fromEntries(Object.entries(value).map(([k, v]) => [k, wrap(v)]));

const views = [
    ["server stats", () => React.createElement(GuildStatsView, { stats: parseGuildStats(require("./fixtures/guild-stats.json")) })],
    ["match summary", () => React.createElement(MatchSummaryView, { match: parseMatchSummary(require("./fixtures/match-summary.json")) })],
    ["player stats", () => React.createElement(UserStatsView, { stats: require("./fixtures/user-stats.json") })],
    ["settings", () => React.createElement(SettingsView, { settings: require("./fixtures/guild-settings.json"), defaults: require("./fixtures/guild-settings-defaults.json"), onChange: () => undefined })],
];

test("every view's text comes from the catalogs: under a pseudo-language no English UI string is left unwrapped", async (t) => {
    for (const [ns, catalog] of Object.entries(catalogs)) i18n.addResourceBundle(PSEUDO, ns, wrap(catalog), true, true);
    // Only switched back, not removed: removing a bundle also drops its namespace from i18n.options.ns.
    t.after(() => i18n.changeLanguage("en"));
    await i18n.changeLanguage(PSEUDO);
    for (const [name, render] of views) {
        const html = renderToStaticMarkup(render());
        assert.doesNotMatch(html, /\b(common|home|commands|premium|settings|stats):[a-z]+\.[a-zA-Z]/, `${name}: raw key rendered`);
        assert.ok(html.includes("⟦"), `${name}: nothing rendered from the catalog`);
        const left = untranslated(html).filter((text) => !ALLOWED.some((ok) => ok.test(text)));
        assert.deepEqual(left, [], `${name}: text rendered outside the catalogs`);
    }
});

/** Text a reader sees (text nodes and the attributes read aloud or shown on hover) left over once every catalog
 * value is cut out. A value with markup (Trans) spans several text nodes, so tags become a separator only after the
 * cut. Dates are formatted for the language rather than translated, so <time> contents are skipped. */
function untranslated(html) {
    const decode = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
    const cut = (s) => { for (let prev; prev !== s;) { prev = s; s = s.replace(/⟦[^⟦⟧]*⟧/g, "\u0000"); } return s.split(/[\u0000\u0001]/); };
    const pieces = [];
    const body = html.replace(/<(code|option|time)\b[^>]*>[\s\S]*?<\/\1>/g, "\u0001");
    for (const m of body.matchAll(/ (?:title|aria-label|alt|placeholder)="([^"]*)"/g)) pieces.push(...cut(decode(m[1])));
    pieces.push(...cut(decode(body.replace(/<[^>]*>/g, "\u0001"))));
    return [...new Set(pieces.map((p) => p.trim()).filter((p) => /[A-Za-z]{3}/.test(p)))];
}

/** What legitimately stays as is: data from the fixtures (server, player and match names) and proper names. */
const fixtureText = new Set();
const collect = (v) => { if (typeof v === "string") fixtureText.add(v); else if (v && typeof v === "object") Object.values(v).forEach(collect); };
for (const file of fs.readdirSync(path.join(__dirname, "fixtures"))) collect(require(`./fixtures/${file}`));
const { MAP_NAMES } = require("../components/stats/match-summary.ts");
const { LANGUAGES } = require("../components/settings/settings-edit.ts");
for (const name of [...Object.values(MAP_NAMES), ...LANGUAGES.map((l) => l.native)]) fixtureText.add(name);
// The blurred premium previews fill in made-up players.
for (const name of [...JSON.stringify(require("../components/stats/user-stats.ts").sampleDetails(0)).matchAll(/"name":"([^"]+)"/g)].map((m) => m[1])) fixtureText.add(name);
const ALLOWED = [{ test: (text) => fixtureText.has(text) }];

test("each namespace is registered with i18next and bundled for the first render", () => {
    for (const ns of Object.keys(catalogs)) {
        assert.ok(i18n.options.ns.includes(ns), `${ns} not in ns`);
        assert.ok(i18n.hasResourceBundle("en", ns), `${ns} not bundled`);
    }
});
