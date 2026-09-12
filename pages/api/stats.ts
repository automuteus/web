import type { NextApiRequest, NextApiResponse } from "next";
import { ServerStats } from "../../types/ServerStats";

const API_URL = process.env.AUTOMUTEUS_API_URL || "https://api.automute.us";

/**
 * Live bot stats for the home page.
 *
 * Deliberately uncached: the page used to bake these into static HTML with
 * ISR, and with several replicas each regenerating on its own schedule,
 * refreshes bounced between stale snapshots. The browser polls this instead.
 */
export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<ServerStats | { error: string }>
) {
    res.setHeader("Cache-Control", "no-store");
    try {
        const upstream = await fetch(`${API_URL}/bot/info`);
        if (!upstream.ok) {
            return res
                .status(502)
                .json({ error: `API returned ${upstream.status}` });
        }
        return res.status(200).json(await upstream.json());
    } catch (err) {
        console.error("Failed to fetch bot info:", err);
        return res.status(502).json({ error: "API unreachable" });
    }
}
