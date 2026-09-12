import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { Guild } from "../../types/Guild";

const DISCORD_GUILDS_URL = "https://discord.com/api/v10/users/@me/guilds";

/**
 * Returns the Discord guilds the signed-in user belongs to.
 *
 * The Discord access token never leaves the server: it's read from the
 * encrypted session cookie here and forwarded to Discord. Once the AutoMuteUs
 * API accepts Discord tokens this should call it instead, so the list can be
 * filtered to guilds where the bot is present and annotated with premium status.
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Guild[] | { error: string }>
) {
    const token = await getToken({ req });
    if (!token?.accessToken || token.error) {
        return res.status(401).json({ error: "Not signed in" });
    }

    const discord = await fetch(DISCORD_GUILDS_URL, {
        headers: { Authorization: `Bearer ${token.accessToken}` },
    });
    if (!discord.ok) {
        return res
            .status(discord.status === 401 ? 401 : 502)
            .json({ error: `Discord returned ${discord.status}` });
    }

    const guilds: Guild[] = (await discord.json()).map((g) => ({
        id: g.id,
        name: g.name,
        icon: g.icon ?? null,
        permissions: g.permissions,
    }));

    // Discord rate-limits this endpoint; let the browser reuse the answer.
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).json(guilds);
}
