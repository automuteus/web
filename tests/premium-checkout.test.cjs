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
const { fingerprint, paymentApplied, returnOutcome, saveCheckout, loadCheckout, isCheckoutReport } = require("../components/premium/checkout.ts");
const { checkoutUrl } = require("../components/premium/PremiumItem.tsx");

const GUILD = "123456789012345678";
const free = { tier: 0, days: 0 };
const gold = { tier: 3, days: 31, subscription: { status: "active", endsAt: 1_800_000_000, inherited: false } };

test("a first purchase is confirmed by the server becoming active", () => {
    const checkout = { guild: GUILD, before: fingerprint(free), since: 0, returned: "paid" };
    assert.equal(paymentApplied(checkout, free, false), false);
    assert.equal(paymentApplied(checkout, gold, true), true);
});

test("a renewal or upgrade starts out active, so only a change to the record counts", () => {
    const checkout = { guild: GUILD, before: fingerprint(gold), since: 0, returned: "paid" };
    assert.equal(paymentApplied(checkout, gold, true), false);
    const renewed = { ...gold, subscription: { ...gold.subscription, endsAt: gold.subscription.endsAt + 31 * 86400 } };
    assert.equal(paymentApplied(checkout, renewed, true), true);
    assert.equal(paymentApplied(checkout, { ...gold, tier: 2 }, true), true);
});

test("without a record from before the purchase, active is the best available proof", () => {
    const checkout = { guild: GUILD, since: 0, returned: "paid" };
    assert.equal(paymentApplied(checkout, free, false), false);
    assert.equal(paymentApplied(checkout, gold, true), true);
});

test("a return is believed paid only when the link's own return URL, which names the server, was used", () => {
    assert.equal(returnOutcome({ guild: GUILD }, "paid"), "paid");
    assert.equal(returnOutcome({ guild: GUILD, cancelled: "1" }, "paid"), "cancelled");
    // A button-level return URL arrives bare, for payments and cancellations alike.
    assert.equal(returnOutcome({}, "paid"), "unknown");
    assert.equal(returnOutcome({}, "unknown"), "unknown");
    assert.equal(returnOutcome({ guild: GUILD }, "unknown"), "unknown");
    // cancelled=1 can only have been set on purpose.
    assert.equal(returnOutcome({ cancelled: "1" }, "unknown"), "cancelled");
});

test("only a well-formed report from the return page is acted on", () => {
    assert.ok(isCheckoutReport({ outcome: "paid", guild: GUILD }));
    // A button-level return URL names no server; the premium page falls back to the checkout it started.
    assert.ok(isCheckoutReport({ outcome: "unknown" }));
    assert.equal(isCheckoutReport({ outcome: "refunded" }), false);
    assert.equal(isCheckoutReport({ outcome: "paid", guild: 5 }), false);
    assert.equal(isCheckoutReport(null), false);
});

test("a checkout survives the tab leaving for PayPal and back, for its own server only, until it is done", () => {
    const store = new Map();
    global.sessionStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) };
    try {
        const since = Date.now();
        const checkout = { guild: GUILD, before: fingerprint(free), since, returned: undefined, tab: true };
        saveCheckout(checkout);
        assert.deepEqual(loadCheckout(GUILD), checkout);
        // The return page, told nothing by PayPal, asks which server the checkout was for.
        assert.deepEqual(loadCheckout(), checkout);
        assert.equal(loadCheckout("876543210987654321"), undefined);
        saveCheckout({ ...checkout, returned: "unknown" });
        assert.equal(loadCheckout(GUILD).returned, "unknown");
        // One older than the page would have waited for is forgotten, not revived on the next visit.
        assert.equal(loadCheckout(GUILD, since + 16 * 60 * 1000), undefined);
        assert.equal(loadCheckout(GUILD), undefined);
        saveCheckout({ ...checkout, done: "confirmed" });
        assert.equal(loadCheckout(GUILD), undefined);
    } finally {
        delete global.sessionStorage;
    }
});

test("the PayPal URL names the server and brings the buyer back to /premium/paid by GET", () => {
    global.window = { location: { origin: "https://automute.us" } };
    try {
        const url = new URL(checkoutUrl("M8D39PF5ADGJW", GUILD));
        assert.equal(url.origin + url.pathname, "https://www.paypal.com/cgi-bin/webscr");
        assert.equal(url.searchParams.get("cmd"), "_s-xclick");
        assert.equal(url.searchParams.get("hosted_button_id"), "M8D39PF5ADGJW");
        assert.equal(url.searchParams.get("custom"), GUILD);
        assert.equal(url.searchParams.get("rm"), "1");
        assert.equal(url.searchParams.get("return"), `https://automute.us/premium/paid?guild=${GUILD}`);
        assert.equal(url.searchParams.get("cancel_return"), `https://automute.us/premium/paid?guild=${GUILD}&cancelled=1`);
        // Signed in, custom also names the buyer, for the payment listener to record; anything else is left off.
        const USER = "223456789012345678";
        assert.equal(new URL(checkoutUrl("M8D39PF5ADGJW", GUILD, USER)).searchParams.get("custom"), `${GUILD}:${USER}`);
        assert.equal(new URL(checkoutUrl("M8D39PF5ADGJW", GUILD, "")).searchParams.get("custom"), GUILD);
        assert.equal(new URL(checkoutUrl("M8D39PF5ADGJW", GUILD, "not-an-id")).searchParams.get("custom"), GUILD);
    } finally {
        delete global.window;
    }
});
