import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "../../../db";
import { fetchDiscordGuilds, updateCachedGuilds } from "../../../utils/server";

export default NextAuth({
  debug: false,

  secret: process.env.SECRET,

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization:
        "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds&response_type=code&prompt=consent",
    }),
  ],

  adapter: PrismaAdapter(prisma),

  pages: {
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: process.env.SECRET,
  },

  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        if (token.accessToken && typeof token.accessToken === "string") {
          const accessToken: string = token.accessToken;
          const guilds = await fetchDiscordGuilds(accessToken);
          const cached = await updateCachedGuilds(user.id, guilds);
          if (cached) token.guilds = guilds;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) session.userId = token.sub;
      if (token) session.guilds = token.guilds;

      return session;
    },
  },
});
