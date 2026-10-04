import { GuildPremium } from "./premium-status";

/** How a checkout ended. unknown is a return PayPal said nothing about: the hosted buttons' own return URL
 * (/premium/callback) overrides the one the link asks for, and carries neither the server nor the outcome. */
export type CheckoutOutcome = "paid" | "cancelled" | "unknown";

/** The data the return page posts to the premium page that opened PayPal in a popup. */
export const CHECKOUT_MESSAGE = "automuteus:checkout";
export interface CheckoutMessage {
    type: typeof CHECKOUT_MESSAGE;
    /** The server paid for, when the return URL named it; otherwise the premium page uses the checkout it started. */
    guild?: string;
    outcome: CheckoutOutcome;
}

export function isCheckoutMessage(data: unknown): data is CheckoutMessage {
    if (!data || typeof data !== "object") return false;
    const { type, outcome } = data as { type?: unknown; outcome?: unknown };
    return type === CHECKOUT_MESSAGE && (outcome === "paid" || outcome === "cancelled" || outcome === "unknown");
}

/** A purchase the premium page is watching: the server's premium as it stood when the buyer left for PayPal, so any
 * change to it is the payment arriving (a renewal or upgrade starts out active, so "active" alone proves nothing). */
export interface Checkout {
    guild: string;
    /** fingerprint() of the record at departure; absent when it was not loaded (the buyer was signed out). */
    before?: string;
    /** When the wait started: departure, then the return from PayPal, which restarts the clock. */
    since: number;
    /** How the buyer came back from PayPal; absent until they do. */
    returned?: "paid" | "unknown";
    done?: "confirmed" | "timeout";
}

/** Poll this often, and give up this long after the buyer's return. PayPal's notification normally lands within a
 * minute; after that the page points at the help form instead of inviting a second purchase. */
export const POLL_EVERY = 10 * 1000;
export const POLL_FOR = 15 * 60 * 1000;

export function fingerprint(record: GuildPremium): string {
    const sub = record.subscription;
    return [record.tier, record.days, sub?.status ?? "", sub?.endsAt ?? ""].join(":");
}

/** Whether a record fetched after checkout shows the payment applied. */
export function paymentApplied(checkout: Checkout, record: GuildPremium, active: boolean): boolean {
    return checkout.before ? fingerprint(record) !== checkout.before : active;
}

/** The checkout survives the tab navigating to PayPal and back (when the popup was blocked) in sessionStorage, which
 * a popup opened from the page also starts out with a copy of. */
const STORAGE_KEY = "automuteus:premium-checkout";

export function saveCheckout(checkout: Checkout | undefined): void {
    try {
        if (checkout && !checkout.done) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
        else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage may be unavailable; the page then only knows what it saw in this load.
    }
}

/** The saved checkout, for the given server or (with none given) whichever server it was for. */
export function loadCheckout(guild?: string): Checkout | undefined {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        const saved = JSON.parse(raw) as Partial<Checkout>;
        if (typeof saved.guild !== "string" || (guild && saved.guild !== guild) || typeof saved.since !== "number") return undefined;
        return {
            guild: saved.guild,
            before: typeof saved.before === "string" ? saved.before : undefined,
            since: saved.since,
            returned: saved.returned === "paid" || saved.returned === "unknown" ? saved.returned : undefined,
        };
    } catch {
        return undefined;
    }
}
