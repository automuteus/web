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
const { fingerprint, paymentApplied, isCheckoutMessage, saveCheckout, loadCheckout, CHECKOUT_MESSAGE } = require("../components/premium/checkout.ts");
const { checkoutUrl } = require("../components/premium/PremiumItem.tsx");

const GUILD = "123456789012345678";
const free = { tier: 0, days: 0 };
const gold = { tier: 3, days: 31, subscription: { status: "active", endsAt: 1_800_000_000, inherited: false } };

test("a first purchase is confirmed by the server becoming active", () => {
    const checkout = { guild: GUILD, before: fingerprint(free), since: 0, returned: true };
    assert.equal(paymentApplied(checkout, free, false), false);
    assert.equal(paymentApplied(checkout, gold, true), true);
});

test("a renewal or upgrade starts out active, so only a change to the record counts", () => {
    const checkout = { guild: GUILD, before: fingerprint(gold), since: 0, returned: true };
    assert.equal(paymentApplied(checkout, gold, true), false);
    const renewed = { ...gold, subscription: { ...gold.subscription, endsAt: gold.subscription.endsAt + 31 * 86400 } };
    assert.equal(paymentApplied(checkout, renewed, true), true);
    assert.equal(paymentApplied(checkout, { ...gold, tier: 2 }, true), true);
});

test("without a record from before the purchase, active is the best available proof", () => {
    const checkout = { guild: GUILD, since: 0, returned: true };
    assert.equal(paymentApplied(checkout, free, false), false);
    assert.equal(paymentApplied(checkout, gold, true), true);
});

test("only the popup's own message type is accepted", () => {
    assert.ok(isCheckoutMessage({ type: CHECKOUT_MESSAGE, guild: GUILD, cancelled: false }));
    assert.equal(isCheckoutMessage({ type: "other" }), false);
    assert.equal(isCheckoutMessage(null), false);
    assert.equal(isCheckoutMessage("automuteus:checkout"), false);
});

test("a checkout survives the tab leaving for PayPal and back, for its own server only, until it is done", () => {
    const store = new Map();
    global.sessionStorage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) };
    try {
        const checkout = { guild: GUILD, before: fingerprint(free), since: 42, returned: false };
        saveCheckout(checkout);
        assert.deepEqual(loadCheckout(GUILD), checkout);
        assert.equal(loadCheckout("876543210987654321"), undefined);
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
        // A donation with no server selected still comes back to the site.
        const donation = new URL(checkoutUrl("YM72RY5TF6WZU", undefined, true));
        assert.equal(donation.searchParams.get("custom"), null);
        assert.equal(donation.searchParams.get("return"), "https://automute.us/premium/paid");
        // A donation with a server selected names it for the ledger, but the return page must not wait on premium.
        const forServer = new URL(checkoutUrl("YM72RY5TF6WZU", GUILD, true));
        assert.equal(forServer.searchParams.get("custom"), GUILD);
        assert.equal(forServer.searchParams.get("return"), "https://automute.us/premium/paid");
        assert.equal(forServer.searchParams.get("cancel_return"), "https://automute.us/premium/paid?cancelled=1");
    } finally {
        delete global.window;
    }
});
