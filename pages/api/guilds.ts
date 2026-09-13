import type { NextApiRequest, NextApiResponse } from "next";
import { Guild } from "../../types/Guild";
import { getDiscordAccessToken } from "../../utils/server/discord-session";

/** The Go API has no guild-list endpoint yet. Keep the complete Discord list
 * for premium purchases, without filtering by admin permission or bot presence.
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

        const guilds: Guild[] = [];
        let after = "";
        const signal = AbortSignal.timeout(12_000);
        for (let page = 0; page < 100; page++) {
            const url = new URL("https://discord.com/api/v10/users/@me/guilds");
            url.searchParams.set("limit", "200");
            if (after) url.searchParams.set("after", after);
            const discord = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store", redirect: "error", signal,
            });
            if (!discord.ok) {
                const status = [401, 403, 429].includes(discord.status) ? discord.status : 502;
                return res.status(status).json({ error: "Unable to load Discord guilds" });
            }
            const data = await discord.json();
            if (!Array.isArray(data)) throw new Error("Invalid guild response");
            for (const g of data) {
                if (!g || typeof g.id !== "string" || !/^[0-9]{17,20}$/.test(g.id) ||
                    typeof g.name !== "string" || typeof g.permissions !== "string" ||
                    !/^[0-9]+$/.test(g.permissions) ||
                    (g.icon != null && typeof g.icon !== "string")) {
                    throw new Error("Invalid guild");
                }
                guilds.push({ id: g.id, name: g.name, icon: g.icon ?? null, permissions: g.permissions });
            }
            if (data.length < 200) return res.status(200).json(guilds);
            const next = data[data.length - 1].id;
            if (next === after) throw new Error("Invalid pagination cursor");
            after = next;
        }
        throw new Error("Too many guild pages");
    } catch {
        return res.status(502).json({ error: "Unable to load Discord guilds" });
    }
}
