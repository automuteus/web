import { GuildPremium } from "./premium-status";

/** The data /premium/paid posts to the premium page that opened PayPal in a popup. */
export const CHECKOUT_MESSAGE = "automuteus:checkout";
export interface CheckoutMessage {
    type: typeof CHECKOUT_MESSAGE;
    /** The server paid for; absent for a donation. */
    guild?: string;
    /** The buyer backed out at PayPal and nothing was charged. */
    cancelled: boolean;
}

export function isCheckoutMessage(data: unknown): data is CheckoutMessage {
    return !!data && typeof data === "object" && (data as { type?: unknown }).type === CHECKOUT_MESSAGE;
}

/** A purchase the premium page is watching: the server's premium as it stood when the buyer left for PayPal, so any
 * change to it is the payment arriving (a renewal or upgrade starts out active, so "active" alone proves nothing). */
export interface Checkout {
    guild: string;
    /** fingerprint() of the record at departure; absent when it was not loaded (the buyer was signed out). */
    before?: string;
    /** When the wait started: departure, then the return from PayPal, which restarts the clock. */
    since: number;
    /** The buyer came back from PayPal, so the page should say what it is waiting for. */
    returned: boolean;
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

/** The checkout survives the tab navigating to PayPal and back (when the popup was blocked) in sessionStorage. */
const STORAGE_KEY = "automuteus:premium-checkout";

export function saveCheckout(checkout: Checkout | undefined): void {
    try {
        if (checkout && !checkout.done) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
        else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // Storage may be unavailable; the page then only knows what it saw in this load.
    }
}

export function loadCheckout(guild: string): Checkout | undefined {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return undefined;
        const saved = JSON.parse(raw) as Partial<Checkout>;
        if (saved.guild !== guild || typeof saved.since !== "number") return undefined;
        return { guild, before: typeof saved.before === "string" ? saved.before : undefined, since: saved.since, returned: saved.returned === true };
    } catch {
        return undefined;
    }
}
