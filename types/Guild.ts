/** A Discord guild the signed-in user belongs to, as returned by /api/guilds. */
export interface Guild {
    id: string;
    name: string;
    icon: string | null;
    /** Permission bitfield as a decimal string, as Discord returns it. */
    permissions: string;
}
