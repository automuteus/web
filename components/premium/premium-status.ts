import { PremiumRecord, premiumActive } from "../stats/guild-stats";

/** Go's premium.NoExpiryCode: a tier granted without a payment date, which never runs out. */
export const NO_EXPIRY = -9999;

/** Go's premium.TierStrings, indexed by tier. */
const TIER_NAMES = ["Free", "Bronze", "Silver", "Gold", "Trial", "Self-hosted"];

export function tierName(tier: number): string {
    return TIER_NAMES[tier] ?? "Premium";
}

/** What the payment listener knows about the subscription paying for a server's premium. */
export interface SubscriptionStatus {
    /** active renews each period; cancelled is paid up until endsAt, then stops. */
    status: "active" | "cancelled";
    /** Unix seconds when the current paid period runs out. */
    endsAt: number;
    /** The subscription belongs to the server this one inherits premium from. */
    inherited?: boolean;
}

export interface GuildPremium extends PremiumRecord {
    /** Absent for premium the listener does not track: from before it existed, granted by hand, or self-hosted. */
    subscription?: SubscriptionStatus;
}

/** Validate a GET /guild/premium body, throwing on anything else so the page shows nothing rather than a guess. */
export function parsePremium(body: unknown): GuildPremium {
    if (!body || typeof body !== "object") throw new Error("Invalid premium record");
    const { tier, days, subscription } = body as { tier?: unknown; days?: unknown; subscription?: unknown };
    if (typeof tier !== "number" || !Number.isInteger(tier) || tier < 0 || typeof days !== "number" || !Number.isInteger(days)) {
        throw new Error("Invalid premium record");
    }
    if (subscription == null) return { tier, days };
    if (typeof subscription !== "object") throw new Error("Invalid subscription");
    const { status, endsAt, inherited } = subscription as { status?: unknown; endsAt?: unknown; inherited?: unknown };
    if ((status !== "active" && status !== "cancelled") || typeof endsAt !== "number" || !Number.isInteger(endsAt) ||
        (inherited != null && typeof inherited !== "boolean")) {
        throw new Error("Invalid subscription");
    }
    return { tier, days, subscription: { status, endsAt, inherited: inherited === true } };
}

export interface PremiumStatus {
    /** active: premium now, and it renews or has no end. ending: premium now, but its subscription is cancelled.
     * expired: a paid tier ran out. free: never had one, or it was transferred away. */
    kind: "active" | "ending" | "expired" | "free";
    message: string;
}

/** Renewal dates are approximate (PayPal bills on its own clock), so a fixed calendar is fine and keeps tests stable. */
function formatDate(unix: number): string {
    return new Date(unix * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** The sentence the premium page shows for the selected server. With a tracked subscription it says whether the
 * premium renews; otherwise the days count down from the server's latest payment and nothing promises a renewal. */
export function describePremium(record: GuildPremium, server: string): PremiumStatus {
    const tier = tierName(record.tier);
    if (premiumActive(record)) {
        if (record.days === NO_EXPIRY) return { kind: "active", message: `${server} has AutoMuteUs ${tier}, with no expiry.` };
        const sub = record.subscription;
        if (sub) {
            const whose = sub.inherited ? "The PayPal subscription of the server it inherits premium from" : "Its PayPal subscription";
            if (sub.status === "active") {
                return { kind: "active", message: `${server} has AutoMuteUs ${tier}. ${whose} renews around ${formatDate(sub.endsAt)}.` };
            }
            return { kind: "ending", message: `${server} has AutoMuteUs ${tier} until ${formatDate(sub.endsAt)}. ${whose} is cancelled and won't renew.` };
        }
        const days = record.days === 1 ? "1 day" : `${record.days} days`;
        return { kind: "active", message: `${server} has AutoMuteUs ${tier}, with ${days} left on its latest payment.` };
    }
    if (record.tier !== 0) return { kind: "expired", message: `${server}'s AutoMuteUs ${tier} has expired.` };
    return { kind: "free", message: `${server} doesn't have AutoMuteUs Premium.` };
}
