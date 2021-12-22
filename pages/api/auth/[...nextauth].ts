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
    async jwt({ token, account, user, profile }) {
      if (account && user && profile) {
        token.accessToken = account.access_token;

        const ext = ".png"; // Eventually check if an animated image exists and use .gif

        let img = profile.avatar
          ? "https://cdn.discordapp.com/avatars/" +
            profile.id +
            "/" +
            profile.avatar +
            ext
          : "https://upload.wikimedia.org/wikipedia/commons/9/90/Discord-512.webp";

        token.picture = img;

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
      if (token) {
        session.userId = token.sub;
        session.guilds = token.guilds;
        if(session.user) session.user.image = token.picture;
      }

      return session;
    },
  },
});
