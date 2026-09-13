import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscordAccessToken } from "./discord-session";

type ReadEndpoint = "/guild/settings" | "/guild/premium" | "/game/state" | "/game/roomcode";
const endpoints: readonly string[] = ["/guild/settings", "/guild/premium", "/game/state", "/game/roomcode"];

/** Fixed, read-only routes. Go remains responsible for guild authorization. */
export function createAPIReadHandler(endpoint: ReadEndpoint) {
    if (!endpoints.includes(endpoint)) throw new Error("Unsupported API endpoint");
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.setHeader("Cache-Control", "no-store");
        if (req.method !== "GET") {
            res.setHeader("Allow", "GET");
            return res.status(405).json({ error: "Method not allowed" });
        }
        const { guildID, connectCode } = req.query;
        if (typeof guildID !== "string" || !/^[0-9]{17,20}$/.test(guildID)) {
            return res.status(400).json({ error: "Invalid guild ID" });
        }
        const game = endpoint.startsWith("/game/");
        if (game && (typeof connectCode !== "string" || !/^[A-Za-z0-9]{8}$/.test(connectCode))) {
            return res.status(400).json({ error: "Invalid connect code" });
        }

        try {
            const token = await getDiscordAccessToken(req, res);
            if (!token) return res.status(401).json({ error: "Sign in with Discord again" });

            // Only a server-controlled URL is used. Reject credentials and redirects
            // so the user's Discord token cannot be forwarded to a different host.
            const upstreamURL = new URL(process.env.AUTOMUTEUS_API_URL || "https://api.automute.us");
            if (!["https:", "http:"].includes(upstreamURL.protocol) || upstreamURL.username || upstreamURL.password) {
                throw new Error("Invalid API URL");
            }
            upstreamURL.pathname = upstreamURL.pathname.replace(/\/$/, "") + endpoint;
            upstreamURL.search = "";
            upstreamURL.hash = "";
            upstreamURL.searchParams.set("guildID", guildID);
            if (game) upstreamURL.searchParams.set("connectCode", connectCode as string);

            const upstream = await fetch(upstreamURL, {
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
                    503: "API authorization is temporarily unavailable",
                };
                const status = messages[upstream.status] ? upstream.status : 502;
                // Do not reflect upstream error bodies, cookies, or headers.
                return res.status(status).json({ error: messages[status] || "API request failed" });
            }
            return res.status(200).json(await upstream.json());
        } catch {
            return res.status(502).json({ error: "API request failed" });
        }
    };
}
