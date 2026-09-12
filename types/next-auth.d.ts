import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            /** Discord user ID (snowflake). */
            id: string;
        };
        /** Set when the Discord token could not be refreshed; the user must sign in again. */
        error?: "RefreshAccessTokenError";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        refreshToken?: string;
        /** Unix seconds. */
        expiresAt?: number;
        error?: "RefreshAccessTokenError";
    }
}
