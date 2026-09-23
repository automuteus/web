import type { NextApiRequest, NextApiResponse } from "next";
import { getDiscordAccessToken } from "./discord-session";
import { upstreamURL } from "./api-proxy";
import { FieldError, isEditable, validateDraft } from "../../components/settings/settings-edit";

/** Strong or weak ETag holding a settings row version, the only form the Go API emits. */
export const ETAG = /^(W\/)?"[0-9]{1,19}"$/;
const FIELD_PATH = /^[A-Za-z0-9_.[\]]{1,120}$/;

/** Keep only well-formed field errors from an upstream body. Messages may echo the caller's own values, which is
 * fine to show back to them, but nothing else from upstream is reflected. */
export function sanitizeFields(value: unknown): FieldError[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const fields: FieldError[] = [];
    for (const entry of value.slice(0, 50)) {
        if (!entry || typeof entry !== "object") continue;
        const { field, message } = entry as { field?: unknown; message?: unknown };
        if (typeof field !== "string" || !FIELD_PATH.test(field) || typeof message !== "string") continue;
        fields.push({ field, message: message.slice(0, 300) });
    }
    return fields.length ? fields : undefined;
}

const messages: Record<number, string> = {
    400: "Some settings were rejected.",
    401: "Sign in with Discord again",
    403: "Access denied for this guild",
    409: "Settings changed elsewhere since you loaded them. Reload and try again.",
    412: "Settings changed elsewhere since you loaded them. Reload and try again.",
    413: "Settings document too large",
    429: "Too many settings changes for this server. Wait a minute and try again.",
    501: "The API is not configured to make this change yet.",
    503: "AutoMuteUs is temporarily unavailable. Try again in a moment.",
};

/** PATCH /api/guild/settings: forwards a whitelisted, pre-validated subset of settings to the Go API with the
 * caller's session, and relays the outcome in a shape the settings page can act on. Go still enforces guild
 * authorization, premium gating, ranges, and the version check. */
export function createSettingsWriteHandler() {
    return async function handler(req: NextApiRequest, res: NextApiResponse) {
        res.setHeader("Cache-Control", "no-store");
        if (req.method !== "PATCH") {
            res.setHeader("Allow", "PATCH");
            return res.status(405).json({ error: "Method not allowed" });
        }
        const { guildID } = req.query;
        if (typeof guildID !== "string" || !/^[0-9]{17,20}$/.test(guildID)) {
            return res.status(400).json({ error: "Invalid guild ID" });
        }
        const body = req.body;
        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return res.status(400).json({ error: "Settings must be a JSON object" });
        }
        const keys = Object.keys(body);
        if (keys.length === 0) return res.status(400).json({ error: "No changes to save" });
        const locked = keys.filter((key) => !isEditable(key));
        if (locked.length) {
            return res.status(400).json({ error: "Some of these settings cannot be changed here.", fields: locked.map((field) => ({ field, message: "cannot be changed here" })) });
        }
        const invalid = validateDraft(body, keys);
        if (invalid.length) {
            return res.status(400).json({ error: `${invalid.length} invalid setting${invalid.length === 1 ? "" : "s"}.`, fields: invalid });
        }
        const rawMatch = req.headers["if-match"];
        const ifMatch = typeof rawMatch === "string" && ETAG.test(rawMatch.trim()) ? rawMatch.trim() : undefined;

        try {
            const token = await getDiscordAccessToken(req, res);
            if (!token) return res.status(401).json({ error: messages[401] });

            const target = upstreamURL("/guild/settings");
            target.searchParams.set("guildID", guildID);
            const upstream = await fetch(target, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    ...(ifMatch ? { "If-Match": ifMatch } : {}),
                },
                body: JSON.stringify(body),
                cache: "no-store",
                redirect: "error",
                signal: AbortSignal.timeout(15_000),
            });
            const etag = upstream.headers.get("etag");
            if (etag && ETAG.test(etag)) res.setHeader("ETag", etag);
            const retryAfter = upstream.headers.get("retry-after");
            if (upstream.status === 429 && retryAfter && /^[0-9]{1,5}$/.test(retryAfter)) res.setHeader("Retry-After", retryAfter);

            if (upstream.ok) {
                const data = await upstream.json();
                if (!data || typeof data !== "object" || Array.isArray(data) || typeof data.language !== "string") {
                    throw new Error("Invalid settings response");
                }
                return res.status(200).json(data);
            }
            let fields: FieldError[] | undefined;
            if (upstream.status === 400 || upstream.status === 403) {
                fields = sanitizeFields((await upstream.json().catch(() => undefined))?.fields);
            }
            const status = messages[upstream.status] ? upstream.status : 502;
            let error = messages[status] || "API request failed";
            if (status === 403 && fields) error = "Premium is required to change some of these settings.";
            if (status === 400 && fields) error = `${fields.length} setting${fields.length === 1 ? " was" : "s were"} rejected.`;
            return res.status(status).json(fields ? { error, fields } : { error });
        } catch {
            return res.status(502).json({ error: "API request failed" });
        }
    };
}
