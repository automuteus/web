import type { TFunction } from "i18next";
import { PremiumRecord, premiumActive } from "../stats/guild-stats";

/** Go's premium.NoExpiryCode: a tier granted without a payment date, which never runs out. */
export const NO_EXPIRY = -9999;

/** Go's premium.TierStrings, indexed by tier. Keys carry the namespace: callers may pass any t. */
export function tierName(tier: number, t: TFunction): string {
    switch (tier) {
        case 0: return t("premium:tier.free");
        case 1: return t("premium:tier.bronze");
        case 2: return t("premium:tier.silver");
        case 3: return t("premium:tier.gold");
        case 4: return t("premium:tier.trial");
        case 5: return t("premium:tier.selfHosted");
        default: return t("premium:tier.premium");
    }
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

/** Renewal dates are approximate (PayPal bills on its own clock), so a fixed calendar is fine and keeps tests stable.
 * Formatted by i18next's datetime formatter in the language of the t it is given. */
function dateParams(unix: number) {
    return {
        date: new Date(unix * 1000),
        formatParams: { date: { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" } as Intl.DateTimeFormatOptions },
    };
}

/** The sentence the premium page shows for the selected server. With a tracked subscription it says whether the
 * premium renews; otherwise the days count down from the server's latest payment and nothing promises a renewal. */
export function describePremium(record: GuildPremium, server: string, t: TFunction): PremiumStatus {
    const tier = tierName(record.tier, t);
    if (premiumActive(record)) {
        if (record.days === NO_EXPIRY) return { kind: "active", message: t("premium:status.noExpiry", { server, tier }) };
        const sub = record.subscription;
        if (sub) {
            const values = { server, tier, ...dateParams(sub.endsAt) };
            if (sub.status === "active") {
                const message = sub.inherited ? t("premium:status.renewsInherited", values) : t("premium:status.renews", values);
                return { kind: "active", message };
            }
            const message = sub.inherited ? t("premium:status.endingInherited", values) : t("premium:status.ending", values);
            return { kind: "ending", message };
        }
        return { kind: "active", message: t("premium:status.days", { server, tier, count: record.days }) };
    }
    if (record.tier !== 0) return { kind: "expired", message: t("premium:status.expired", { server, tier }) };
    return { kind: "free", message: t("premium:status.free", { server }) };
}
