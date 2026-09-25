import { PremiumRecord, premiumActive } from "../stats/guild-stats";

/** Go's premium.NoExpiryCode: a tier granted without a payment date, which never runs out. */
export const NO_EXPIRY = -9999;

/** Go's premium.TierStrings, indexed by tier. */
const TIER_NAMES = ["Free", "Bronze", "Silver", "Gold", "Trial", "Self-hosted"];

export function tierName(tier: number): string {
    return TIER_NAMES[tier] ?? "Premium";
}

/** Validate a GET /guild/premium body, throwing on anything else so the page shows nothing rather than a guess. */
export function parsePremium(body: unknown): PremiumRecord {
    if (!body || typeof body !== "object") throw new Error("Invalid premium record");
    const { tier, days } = body as { tier?: unknown; days?: unknown };
    if (typeof tier !== "number" || !Number.isInteger(tier) || tier < 0 || typeof days !== "number" || !Number.isInteger(days)) {
        throw new Error("Invalid premium record");
    }
    return { tier, days };
}

export interface PremiumStatus {
    /** active: premium now. expired: a paid tier ran out. free: never had one, or it was transferred away. */
    kind: "active" | "expired" | "free";
    message: string;
}

/** The sentence the premium page shows for the selected server. Days count down from the server's latest payment;
 * whether its PayPal subscription will renew is not recorded, so nothing here promises a renewal. */
export function describePremium(record: PremiumRecord, server: string): PremiumStatus {
    const tier = tierName(record.tier);
    if (premiumActive(record)) {
        if (record.days === NO_EXPIRY) return { kind: "active", message: `${server} has AutoMuteUs ${tier}, with no expiry.` };
        const days = record.days === 1 ? "1 day" : `${record.days} days`;
        return { kind: "active", message: `${server} has AutoMuteUs ${tier}, with ${days} left on its latest payment.` };
    }
    if (record.tier !== 0) return { kind: "expired", message: `${server}'s AutoMuteUs ${tier} has expired.` };
    return { kind: "free", message: `${server} doesn't have AutoMuteUs Premium.` };
}
