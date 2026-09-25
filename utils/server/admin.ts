/** Operators who may open any server's stats pages. Set ADMIN_USER_IDS to their Discord user IDs, comma-separated,
 * and API_ADMIN_PASS to the Go API's admin password; both must be present for admin views to happen at all. Only
 * the read-only stats routes use it (see api-proxy.ts); settings, resets, and premium always go through the
 * user's own Discord session. */
export function isAdminUser(userId: string | undefined): boolean {
    if (!userId || !/^[0-9]{17,20}$/.test(userId)) return false;
    return (process.env.ADMIN_USER_IDS || "").split(",").map((id) => id.trim()).includes(userId);
}

/** The Basic Authorization header for the API's admin account, or null when none is configured. */
export function adminAuthorization(): string | null {
    const pass = process.env.API_ADMIN_PASS;
    if (!pass) return null;
    return "Basic " + Buffer.from(`admin:${pass}`).toString("base64");
}
