/** A Discord guild the signed-in user belongs to, as returned by /api/guilds. */
export interface Guild {
    id: string;
    name: string;
    icon: string | null;
    /** True when the signed-in user owns the guild. */
    owner: boolean;
    /** Permission bitfield as a decimal string, as Discord returns it. */
    permissions: string;
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
