import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscordAccessToken } from "./discord-session";

type ReadEndpoint = "/guild/settings" | "/guild/premium" | "/guild/bot" | "/guild/channel" | "/guild/channels" | "/guild/roles" | "/guild/stats" | "/guild/match" | "/game/state" | "/game/roomcode";
const endpoints: readonly string[] = ["/guild/settings", "/guild/premium", "/guild/bot", "/guild/channel", "/guild/channels", "/guild/roles", "/guild/stats", "/guild/match", "/game/state", "/game/roomcode"];

/** Optional reshaping of a successful upstream body before it reaches the browser. Throwing means the upstream
 * body was not what this route expects and the browser gets a 502 instead of a partial object. */
export type ResponseShaper = (body: unknown, context: { guildID: string }) => unknown;

/** Server-controlled Go API URL for one fixed endpoint. Credentials in the configured URL are rejected so a
 * user's Discord token can never be forwarded to a different host. */
export function upstreamURL(endpoint: string): URL {
    const url = new URL(process.env.AUTOMUTEUS_API_URL || "https://api.automute.us");
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
        throw new Error("Invalid API URL");
    }
    url.pathname = url.pathname.replace(/\/$/, "") + endpoint;
    url.search = "";
    url.hash = "";
    return url;
}

/** Fixed, read-only routes. Go remains responsible for guild authorization. */
export function createAPIReadHandler(endpoint: ReadEndpoint, shape?: ResponseShaper) {
    if (!endpoints.includes(endpoint)) throw new Error("Unsupported API endpoint");
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.setHeader("Cache-Control", "no-store");
        if (req.method !== "GET") {
            res.setHeader("Allow", "GET");
            return res.status(405).json({ error: "Method not allowed" });
        }
        const { guildID, connectCode, channelID, matchID } = req.query;
        if (typeof guildID !== "string" || !/^[0-9]{17,20}$/.test(guildID)) {
            return res.status(400).json({ error: "Invalid guild ID" });
        }
        const game = endpoint.startsWith("/game/");
        if (game && (typeof connectCode !== "string" || !/^[A-Za-z0-9]{8}$/.test(connectCode))) {
            return res.status(400).json({ error: "Invalid connect code" });
        }
        const channel = endpoint === "/guild/channel";
        if (channel && (typeof channelID !== "string" || !/^[0-9]{17,20}$/.test(channelID))) {
            return res.status(400).json({ error: "Invalid channel ID" });
        }
        // A match ID is a positive Postgres bigint, written without leading zeros as Go requires.
        const match = endpoint === "/guild/match";
        if (match && (typeof matchID !== "string" || !/^[1-9][0-9]{0,17}$/.test(matchID))) {
            return res.status(400).json({ error: "Invalid match ID" });
        }

        try {
            const token = await getDiscordAccessToken(req, res);
            if (!token) return res.status(401).json({ error: "Sign in with Discord again" });

            // Only a server-controlled URL is used, and redirects are rejected below.
            const target = upstreamURL(endpoint);
            target.searchParams.set("guildID", guildID);
            if (game) target.searchParams.set("connectCode", connectCode as string);
            if (channel) target.searchParams.set("channelID", channelID as string);
            if (match) target.searchParams.set("matchID", matchID as string);

            const upstream = await fetch(target, {
                headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
                cache: "no-store",
                redirect: "error",
                signal: AbortSignal.timeout(12_000),
            });
            if (!upstream.ok) {
                const messages: Record<number, string> = {
                    400: "Invalid API request",
                    401: "Sign in with Discord again",
                    403: "Access denied for this guild",
                    404: "Not found",
                    429: "Too many requests; try again later",
                    501: "The API is not configured for this request",
                    503: "API authorization is temporarily unavailable",
                };
                const status = messages[upstream.status] ? upstream.status : 502;
                // Do not reflect upstream error bodies, cookies, or headers.
                return res.status(status).json({ error: messages[status] || "API request failed" });
            }
            // The settings route's ETag is the row version a later PATCH sends back as If-Match.
            const etag = upstream.headers.get("etag");
            if (etag && /^(W\/)?"[0-9]{1,19}"$/.test(etag)) res.setHeader("ETag", etag);
            const body = await upstream.json();
            return res.status(200).json(shape ? shape(body, { guildID }) : body);
        } catch {
            return res.status(502).json({ error: "API request failed" });
        }
    };
}
