import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import DiscordProvider from "next-auth/providers/discord";

const DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";

// Refresh close to expiry, using the lifetime returned by Discord.
async function refreshDiscordToken(token: JWT): Promise<JWT> {
    try {
        if (!token.refreshToken) throw new Error("Missing refresh token");
        const res = await fetch(DISCORD_TOKEN_URL, {
            method: "POST",
            redirect: "error",
            signal: AbortSignal.timeout(8_000),
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
        if (typeof data.access_token !== "string" || !data.access_token ||
            typeof data.expires_in !== "number" || !Number.isFinite(data.expires_in) || data.expires_in <= 60 ||
            (data.refresh_token !== undefined && (typeof data.refresh_token !== "string" || !data.refresh_token))) {
            throw new Error("Invalid token response");
        }
        return {
            ...token,
            accessToken: data.access_token,
            refreshToken: data.refresh_token ?? token.refreshToken,
            expiresAt: Math.floor(Date.now() / 1000) + data.expires_in,
            error: undefined,
        };
    } catch {
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
        async jwt({ token, account, profile }) {
            // First sign-in: stash the Discord tokens, and the user's Discord language for the UI.
            if (account) {
                const locale = (profile as { locale?: unknown } | undefined)?.locale;
                token.locale = typeof locale === "string" ? locale : undefined;
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at;
                token.error = undefined;
                return token;
            }

            // A failed refresh requires a fresh sign-in; never reuse the old token.
            if (token.error) return token;

            // Still valid (with a minute of slack).
            if (token.expiresAt && Date.now() / 1000 < token.expiresAt - 60) {
                return token;
            }

            return refreshDiscordToken(token);
        },

        async session({ session, token }) {
            // `sub` is the Discord user ID when no adapter is configured.
            session.user.id = token.sub;
            session.user.locale = token.locale;
            session.error = token.error;
            return session;
        },
    },
};

