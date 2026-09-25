import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            /** Discord user ID (snowflake). */
            id: string;
            /** Listed in ADMIN_USER_IDS: the stats pages may open any server by ID. */
            admin?: boolean;
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
