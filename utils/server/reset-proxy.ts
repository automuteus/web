import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscordAccessToken } from "./discord-session";
import { upstreamURL } from "./api-proxy";
import { ETAG } from "./settings-write";

type ResetEndpoint = "/guild/stats/reset" | "/guild/user/reset" | "/guild/settings/reset";
const endpoints: readonly string[] = ["/guild/stats/reset", "/guild/user/reset", "/guild/settings/reset"];

/** What a stats reset reports back: the games deleted, or the games a player was removed from. */
export type StatsReset = { guildId: string; userId?: string; games: number };

const SNOWFLAKE = /^[0-9]{17,20}$/;

function parseStatsReset(body: unknown): StatsReset {
    const b = body as Partial<StatsReset> | null;
    if (!b || typeof b !== "object" || typeof b.guildId !== "string" || !SNOWFLAKE.test(b.guildId) ||
        (b.userId !== undefined && (typeof b.userId !== "string" || !SNOWFLAKE.test(b.userId))) ||
        typeof b.games !== "number" || !Number.isSafeInteger(b.games) || b.games < 0) {
        throw new Error("Invalid reset response");
    }
    return { guildId: b.guildId, ...(b.userId ? { userId: b.userId } : {}), games: b.games };
}

const messages: Record<number, string> = {
    400: "Invalid reset request",
    401: "Sign in with Discord again",
    403: "Only the server owner, or members with the Administrator or Manage Server permission, can reset this.",
    409: "Settings changed elsewhere since you loaded them. Reload and try again.",
    412: "Settings changed elsewhere since you loaded them. Reload and try again.",
    429: "Too many settings changes for this server. Wait a minute and try again.",
    503: "AutoMuteUs is temporarily unavailable. Try again in a moment.",
};

/** POST /api/guild/.../reset: forwards one fixed reset route with the caller's session. Go decides who may reset
 * (managers anything, any member their own player stats);
 * this only checks the request's shape. A reset destroys data, so the request must be JSON, which a cross-site
 * form cannot send without a CORS preflight this app never answers. */
export function createResetHandler(endpoint: ResetEndpoint) {
    if (!endpoints.includes(endpoint)) throw new Error("Unsupported API endpoint");
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.setHeader("Cache-Control", "no-store");
        if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            return res.status(405).json({ error: "Method not allowed" });
        }
        if (!/^application\/json\b/i.test(req.headers["content-type"] || "")) {
            return res.status(415).json({ error: "Send the reset as JSON" });
        }
        const { guildID, userID } = req.query;
        if (typeof guildID !== "string" || !SNOWFLAKE.test(guildID)) {
            return res.status(400).json({ error: "Invalid guild ID" });
        }
        const user = endpoint === "/guild/user/reset";
        if (user && (typeof userID !== "string" || !SNOWFLAKE.test(userID))) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const settings = endpoint === "/guild/settings/reset";
        const rawMatch = req.headers["if-match"];
        const ifMatch = settings && typeof rawMatch === "string" && ETAG.test(rawMatch.trim()) ? rawMatch.trim() : undefined;

        try {
            const token = await getDiscordAccessToken(req, res);
            if (!token) return res.status(401).json({ error: messages[401] });

            const target = upstreamURL(endpoint);
            target.searchParams.set("guildID", guildID);
            if (user) target.searchParams.set("userID", userID as string);
            const upstream = await fetch(target, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json", ...(ifMatch ? { "If-Match": ifMatch } : {}) },
                cache: "no-store",
                redirect: "error",
                signal: AbortSignal.timeout(15_000),
            });
            const etag = upstream.headers.get("etag");
            if (settings && etag && ETAG.test(etag)) res.setHeader("ETag", etag);
            const retryAfter = upstream.headers.get("retry-after");
            if (upstream.status === 429 && retryAfter && /^[0-9]{1,5}$/.test(retryAfter)) res.setHeader("Retry-After", retryAfter);

            if (upstream.ok) {
                const data = await upstream.json();
                if (!settings) return res.status(200).json(parseStatsReset(data));
                if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.language !== "string") {
                    throw new Error("Invalid settings response");
                }
                return res.status(200).json(data);
            }
            // Do not reflect upstream error bodies.
            const status = messages[upstream.status] ? upstream.status : 502;
            const error = status === 403 && user ? "You can reset your own stats; resetting another player's needs the server owner, Administrator, or Manage Server."
                : messages[status] || "API request failed";
            return res.status(status).json({ error });
        } catch {
            return res.status(502).json({ error: "API request failed" });
        }
    };
}
