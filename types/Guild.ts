/** A Discord guild the signed-in user belongs to, as returned by /api/guilds. */
export interface Guild {
    id: string;
    name: string;
    icon: string | null;
    /** True when the signed-in user owns the guild. */
    owner: boolean;
    /** Permission bitfield as a decimal string, as Discord returns it. */
    permissions: string;
    /** Whether AutoMuteUs is in the guild, as of the last join or leave the bot saw. */
    botPresent: boolean;
    /** Whether the guild has a finished game recorded, even if the bot has since left. */
    hasStats: boolean;
}

/** A stand-in for a server an operator opened by ID without being a member of it. It carries no permissions, so
 * nothing that changes the server is offered. */
export function adminGuild(id: string): Guild | undefined {
    if (!/^[0-9]{17,20}$/.test(id)) return undefined;
    return { id, name: `Server ${id}`, icon: null, owner: false, permissions: "0", botPresent: true, hasStats: true };
}

/** Guilds whose stats page has something to show, or soon will because the bot is there to record games. */
export function hasStatsPage(guild: Pick<Guild, "botPresent" | "hasStats">): boolean {
    return guild.hasStats || guild.botPresent;
}

// Bits 3 (Administrator) and 5 (Manage Server) of Discord's permission bitfield. BigInt() call form because
// tsconfig targets ES5.
const SETTINGS_PERMISSIONS = BigInt(8 | 32);

/** Whether the user can change this guild's settings. Mirrors the Go API's
 * WriteSettings policy: guild owner, or the Administrator or Manage Server permission.
 * The bitfield exceeds 53 bits, so it must be parsed as a BigInt.
 */
export function canManageGuild(guild: Pick<Guild, "owner" | "permissions">): boolean {
    if (guild.owner === true) return true;
    if (typeof guild.permissions !== "string" || !/^[0-9]+$/.test(guild.permissions)) return false;
    return (BigInt(guild.permissions) & SETTINGS_PERMISSIONS) !== BigInt(0);
}
