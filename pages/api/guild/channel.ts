import { createAPIReadHandler } from "../../../utils/server/api-proxy";

/** Shape of a summary channel check as the Go API reports it. */
export interface ChannelCheck {
    id: string;
    /** Present only when the channel is in the requested guild. */
    name?: string;
    ok: boolean;
    problems: string[];
}

/** GET /api/guild/channel?guildID=&channelID=: can the bot post match summaries into this channel? The same check
 * runs again when the setting is saved, so this is a preview for the settings page, not a permission grant. */
export default createAPIReadHandler("/guild/channel", (body, { guildID }): ChannelCheck => {
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid channel check");
    const { id, name, ok, problems } = body as { id?: unknown; name?: unknown; ok?: unknown; problems?: unknown };
    if (typeof id !== "string" || typeof ok !== "boolean" || !Array.isArray(problems) || !problems.every((p) => typeof p === "string")) {
        throw new Error("Invalid channel check");
    }
    if (ok && problems.length) throw new Error("Invalid channel check");
    void guildID;
    const check: ChannelCheck = { id, ok, problems: problems.map((p) => p.slice(0, 300)).slice(0, 10) };
    if (typeof name === "string" && name) check.name = name.slice(0, 100);
    return check;
});
