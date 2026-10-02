import { createAPIReadHandler } from "../../../utils/server/api-proxy";

/** The hosted bot's Discord application and the permissions it asks for, both taken from the
 * https://add.automute.us redirect the home page uses. This is not the site's own OAuth application
 * (DISCORD_CLIENT_ID), which only signs users in; inviting that one adds nothing to the server. */
export const BOT_CLIENT_ID = "753795015830011944";
export const BOT_PERMISSIONS = "397297445952";

export interface BotPresence {
    present: boolean;
    /** Discord authorize URL for the bot, preselecting this server. */
    invite?: string;
}

/** The bot application to invite: DISCORD_BOT_CLIENT_ID for a self-hosted bot, else the hosted one. */
export function botClientID(env: NodeJS.ProcessEnv = process.env): string {
    const id = env.DISCORD_BOT_CLIENT_ID;
    return id && /^[0-9]{17,20}$/.test(id) ? id : BOT_CLIENT_ID;
}

/** Build the bot invite for one server: the home page's invite plus guild_id, and disable_guild_select so the
 * user stays on the server they chose here. */
export function inviteURL(clientID: string | undefined, guildID: string): string | undefined {
    if (!clientID || !/^[0-9]{17,20}$/.test(clientID)) return undefined;
    const url = new URL("https://discord.com/oauth2/authorize");
    url.searchParams.set("client_id", clientID);
    url.searchParams.set("scope", "bot applications.commands");
    url.searchParams.set("permissions", BOT_PERMISSIONS);
    url.searchParams.set("guild_id", guildID);
    url.searchParams.set("disable_guild_select", "true");
    return url.toString();
}

export default createAPIReadHandler("/guild/bot", (body, { guildID }): BotPresence => {
    if (!body || typeof body !== "object" || typeof (body as { present?: unknown }).present !== "boolean") {
        throw new Error("Invalid bot presence response");
    }
    const present = (body as { present: boolean }).present;
    const invite = present ? undefined : inviteURL(botClientID(), guildID);
    return invite ? { present, invite } : { present };
});
