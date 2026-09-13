import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

/** Run NextAuth's refresh callback and persist the rotated encrypted cookie.
 * Capture the token only in this request's closure, never in the public session.
 */
export async function getDiscordAccessToken(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<string | null> {
    let accessToken: string | null = null;
    const session = await getServerSession(req, res, {
        ...authOptions,
        callbacks: {
            ...authOptions.callbacks,
            async session(args) {
                const { token } = args;
                if (
                    !token.error && token.accessToken && token.expiresAt &&
                    token.expiresAt > Date.now() / 1000
                ) {
                    accessToken = token.accessToken;
                }
                return authOptions.callbacks.session(args);
            },
        },
    });
    return session ? accessToken : null;
}
