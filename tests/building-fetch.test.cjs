const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
}).outputText, filename);
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { fetchWhileBuilding, retryDelay, BUILD_WAIT_BUDGET } = require("../components/stats/building-fetch.ts");

function mockFetch(t, answers) {
    const calls = [];
    t.mock.method(globalThis, "fetch", async (url, init) => {
        calls.push({ url: String(url), init });
        const next = answers.shift();
        if (!next) throw new Error("unexpected fetch");
        return typeof next === "function" ? next() : next;
    });
    return calls;
}
const building = (retryAfter) => new Response("{}", { status: 503, headers: retryAfter === undefined ? {} : { "Retry-After": retryAfter } });
const ok = () => new Response("{}", { status: 200 });

/** A fake clock: waits advance it instead of sleeping. */
function clock() {
    let t = 0;
    const waits = [];
    return { now: () => t, waits, wait: async (ms) => { waits.push(ms); t += ms; } };
}

test("Retry-After is honoured within bounds and defaults when absent or malformed", () => {
    assert.equal(retryDelay("5"), 5_000);
    assert.equal(retryDelay("0"), 2_000);
    assert.equal(retryDelay("1"), 2_000);
    assert.equal(retryDelay("15"), 15_000);
    assert.equal(retryDelay("900"), 15_000);
    assert.equal(retryDelay(null), 5_000);
    assert.equal(retryDelay(""), 5_000);
    assert.equal(retryDelay("Wed, 21 Oct 2015 07:28:00 GMT"), 5_000);
    assert.equal(retryDelay("5.5"), 5_000);
});

test("anything but 503 is returned at once without waiting", async (t) => {
    for (const status of [200, 401, 403, 404, 429, 500, 502]) {
        const calls = mockFetch(t, [new Response("{}", { status })]);
        const c = clock();
        const waited = [];
        const res = await fetchWhileBuilding("/api/guild/stats?guildID=1", { signal: new AbortController().signal, onWaiting: (ms) => waited.push(ms), ...c });
        assert.equal(res.status, status);
        assert.equal(calls.length, 1);
        assert.deepEqual(c.waits, []);
        assert.deepEqual(waited, []);
        assert.equal(calls[0].init.cache, "no-store");
    }
});

test("503s are retried on the API's schedule until the document arrives", async (t) => {
    const calls = mockFetch(t, [building("5"), building("2"), building(undefined), ok()]);
    const c = clock();
    const waited = [];
    const res = await fetchWhileBuilding("/api/guild/stats?guildID=1", { signal: new AbortController().signal, onWaiting: (ms) => waited.push(ms), ...c });
    assert.equal(res.status, 200);
    assert.equal(calls.length, 4);
    assert.ok(calls.every((call) => call.url === "/api/guild/stats?guildID=1"));
    assert.deepEqual(c.waits, [5_000, 2_000, 5_000]);
    assert.deepEqual(waited, [0, 5_000, 7_000]);
});

test("the last 503 is returned once the budget would be exceeded", async (t) => {
    const calls = mockFetch(t, [building("15"), building("15"), building("15"), ok()]);
    const c = clock();
    const res = await fetchWhileBuilding("/api/guild/stats?guildID=1", { signal: new AbortController().signal, budgetMs: 40_000, ...c });
    assert.equal(res.status, 503);
    assert.equal(calls.length, 3, "the third 503 at 30s cannot wait another 15s inside 40s");
    assert.deepEqual(c.waits, [15_000, 15_000]);
});

test("the default budget outlasts the API's two-minute build and a few polls beyond it", () => {
    assert.ok(BUILD_WAIT_BUDGET >= 120_000 + 15_000);
    assert.ok(BUILD_WAIT_BUDGET <= 5 * 60_000);
});

test("aborting during a wait stops the loop and rejects like fetch does", async (t) => {
    const calls = mockFetch(t, [building("5"), ok()]);
    const controller = new AbortController();
    const reason = new DOMException("gone", "AbortError");
    const wait = (ms, signal) => new Promise((_, reject) => { signal.addEventListener("abort", () => reject(signal.reason)); controller.abort(reason); });
    await assert.rejects(fetchWhileBuilding("/api/guild/stats?guildID=1", { signal: controller.signal, wait }), (err) => err === reason);
    assert.equal(calls.length, 1);
});

test("a wait started on an already-aborted signal rejects without sleeping", async (t) => {
    mockFetch(t, [building("5")]);
    const controller = new AbortController();
    let aborted = false;
    // Abort right after the first answer, before the real sleep begins; the real wait must notice.
    t.mock.method(globalThis, "fetch", async () => { controller.abort(); aborted = true; return building("5"); });
    const started = Date.now();
    await assert.rejects(fetchWhileBuilding("/api/guild/stats?guildID=1", { signal: controller.signal }), (err) => err.name === "AbortError");
    assert.ok(aborted);
    assert.ok(Date.now() - started < 1_000, "must not have slept for the Retry-After");
});
