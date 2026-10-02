import type { NextApiRequest, NextApiResponse } from "next";
import { Guild } from "../../types/Guild";
import { getDiscordAccessToken } from "../../utils/server/discord-session";
import { upstreamURL } from "../../utils/server/api-proxy";

/** Every Discord guild of the signed-in user, from the Go API's GET /user/guilds, which pages through Discord and
 * tags each guild with bot presence and recorded stats. Nothing is filtered here: premium purchases need the
 * complete list, and each page picks the guilds it can use.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Guild[] | { error: string }>
) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const token = await getDiscordAccessToken(req, res);
        if (!token) return res.status(401).json({ error: "Sign in with Discord again" });

        const upstream = await fetch(upstreamURL("/user/guilds"), {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12_000),
        });
        if (!upstream.ok) {
            // Do not reflect upstream error bodies, cookies, or headers.
            const status = [401, 403, 429, 503].includes(upstream.status) ? upstream.status : 502;
            return res.status(status).json({ error: "Unable to load Discord guilds" });
        }
        const data = await upstream.json();
        if (!Array.isArray(data)) throw new Error("Invalid guild response");
        const guilds: Guild[] = data.map((g) => {
            if (!g || typeof g.id !== "string" || !/^[0-9]{17,20}$/.test(g.id) ||
                typeof g.name !== "string" || typeof g.permissions !== "string" ||
                !/^[0-9]+$/.test(g.permissions) || typeof g.owner !== "boolean" ||
                (g.icon != null && typeof g.icon !== "string") ||
                typeof g.botPresent !== "boolean" || typeof g.hasStats !== "boolean") {
                throw new Error("Invalid guild");
            }
            return { id: g.id, name: g.name, icon: g.icon ?? null, owner: g.owner, permissions: g.permissions,
                botPresent: g.botPresent, hasStats: g.hasStats };
        });
        return res.status(200).json(guilds);
    } catch {
        return res.status(502).json({ error: "Unable to load Discord guilds" });
    }
}
