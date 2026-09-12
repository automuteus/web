import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";

// Discord access tokens last 7 days. When one is close to expiring, swap it
// for a new one using the refresh token so the user doesn't get logged out.
async function refreshDiscordToken(token: JWT): Promise<JWT> {
    try {
        const res = await fetch(DISCORD_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken,
            }),
        });
        if (!res.ok) throw new Error(`Discord token refresh failed: ${res.status}`);

        const data = await res.json();
        return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.refresh_token ?? token.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
            error: undefined,
        };
    } catch (err) {
        console.error(err);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization: { params: { scope: "identify guilds" } },
        }),
    ],

    // No database: the session lives entirely in an encrypted JWT cookie,
    // which also carries the Discord OAuth tokens for server-side API calls.
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, account }) {
            // First sign-in: stash the Discord tokens.
            if (account) {
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                return token;
            }

            // Still valid (with a minute of slack).
            if (token.expiresAt && Date.now() / 1000 < token.expiresAt - 60) {
                return token;
            }

            return refreshDiscordToken(token);
        },

        async session({ session, token }) {
            // `sub` is the Discord user ID when no adapter is configured.
            session.user.id = token.sub;
            session.error = token.error;
            return session;
        },
    },
};

export default NextAuth(authOptions);
