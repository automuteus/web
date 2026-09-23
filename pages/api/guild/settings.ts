import type { NextApiRequest, NextApiResponse } from "next";
import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import { createSettingsWriteHandler } from "../../../utils/server/settings-write";

const read = createAPIReadHandler("/guild/settings");
const write = createSettingsWriteHandler();

/** A complete settings document is a few KiB; the Go API refuses anything over 64 KiB as well. */
export const config = { api: { bodyParser: { sizeLimit: "64kb" } } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") return read(req, res);
    if (req.method === "PATCH") return write(req, res);
    res.setHeader("Allow", "GET, PATCH");
    res.setHeader("Cache-Control", "no-store");
    return res.status(405).json({ error: "Method not allowed" });
}
