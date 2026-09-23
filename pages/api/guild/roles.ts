import { createAPIReadHandler } from "../../../utils/server/api-proxy";
import type { GuildRole } from "../../../components/settings/settings-edit";

/** GET /api/guild/roles?guildID=: the guild's roles as the bot sees them, in Discord's display order and without
 * @everyone. The settings page uses this to show role names and colours and to offer a picker for operator roles. */
export default createAPIReadHandler("/guild/roles", (body): GuildRole[] => {
    if (!Array.isArray(body)) throw new Error("Invalid role list");
    return body.slice(0, 250).map((entry) => {
        const { id, name, color, position, managed } = (entry ?? {}) as Record<string, unknown>;
        if (typeof id !== "string" || !/^[0-9]{17,20}$/.test(id) || typeof name !== "string" || typeof color !== "number" || typeof position !== "number") {
            throw new Error("Invalid role list");
        }
        return { id, name: name.slice(0, 100), color: Number.isInteger(color) && color >= 0 && color <= 0xffffff ? color : 0, position, managed: managed === true };
    });
});
