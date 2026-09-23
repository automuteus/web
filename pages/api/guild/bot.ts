import { createAPIReadHandler } from "../../../utils/server/api-proxy";

/** Permission bitfield the hosted bot asks for, taken from the https://add.automute.us redirect. */
export const BOT_PERMISSIONS = "397297445952";

export interface BotPresence {
    present: boolean;
    /** Discord authorize URL preselecting this server. Absent when DISCORD_CLIENT_ID is not configured. */
    invite?: string;
}

/** Build the bot invite for one server. disable_guild_select keeps the user on the server they chose here. */
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
    const invite = present ? undefined : inviteURL(process.env.DISCORD_CLIENT_ID, guildID);
    return invite ? { present, invite } : { present };
});
