import type { NextApiRequest, NextApiResponse } from "next";
import { upstreamURL } from "../../../utils/server/api-proxy";

/** The bot's default guild settings, from the Go API. They are the same for every guild and not secret, so no
 * session is required and the browser may cache them briefly. The settings page compares a guild's document
 * against this to mark customised values. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        res.setHeader("Cache-Control", "no-store");
        return res.status(405).json({ error: "Method not allowed" });
    }
    try {
        const upstream = await fetch(upstreamURL("/bot/settings/defaults"), {
            headers: { Accept: "application/json" },
            cache: "no-store",
            redirect: "error",
            signal: AbortSignal.timeout(12_000),
        });
        if (!upstream.ok) {
            res.setHeader("Cache-Control", "no-store");
            const status = [429, 503].includes(upstream.status) ? upstream.status : 502;
            return res.status(status).json({ error: "Default settings unavailable" });
        }
        const body = await upstream.json();
        if (!body || typeof body !== "object" || Array.isArray(body) || typeof body.language !== "string") {
            throw new Error("Invalid defaults response");
        }
        res.setHeader("Cache-Control", "public, max-age=300");
        return res.status(200).json(body);
    } catch {
        res.setHeader("Cache-Control", "no-store");
        return res.status(502).json({ error: "Default settings unavailable" });
    }
}
