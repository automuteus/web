import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import type { GuildChannel } from "../../../components/settings/settings-edit";

/** GET /api/guild/channels?guildID=: the guild's text and announcement channels as the bot sees them, in Discord's
 * display order with their category, each with the bot's verdict as a match summary destination. The Go API
 * requires the settings permission for this, since channel names can be private. */
export default createAPIReadHandler("/guild/channels", (body): GuildChannel[] => {
    if (!Array.isArray(body)) throw new Error("Invalid channel list");
    return body.slice(0, 500).map((entry) => {
        const { id, name, type, category, ok, problems } = (entry ?? {}) as Record<string, unknown>;
        if (typeof id !== "string" || !/^[0-9]{17,20}$/.test(id) || typeof name !== "string" || typeof type !== "number" || typeof ok !== "boolean" || !Array.isArray(problems)) {
            throw new Error("Invalid channel list");
        }
        return {
            id, name: name.slice(0, 100), type, category: typeof category === "string" ? category.slice(0, 100) : "", ok,
            problems: problems.filter((p): p is string => typeof p === "string").slice(0, 10).map((p) => p.slice(0, 300)),
        };
    });
});
