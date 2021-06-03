import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import { PrismaClient } from "@prisma/client";

import * as util from "../../../utils/server";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

const options = {
  debug: false,

  secret: process.env.SECRET,

  providers: [
    Providers.Discord({
      // @ts-ignore
      clientId: process.env.DISCORD_CLIENT_ID,
      // @ts-ignore
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify email guilds",
      authorizationUrl:
        "https://discord.com/api/oauth2/authorize?response_type=code&prompt=consent",
    }),
  ],

  adapter: Adapters.Prisma.Adapter({
    prisma,
    modelMapping: {
      User: "user",
      Account: "account",
      Session: "session",
      VerificationRequest: "verificationRequest",
      // @ts-ignore
      Guild: "guild",
      UserGuild: "userGuild",
    },
  }),

  pages: {
    error: "/auth/error",
  },

  session: {
    jwt: true,
  },

  callbacks: {
    // @ts-ignore
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account && user) {
        const uid = user.id ?? user.userId;
        // @ts-ignore
        const ext = ".png"; // Eventually check if an animated image exists and use .gif

        token = {
          id: uid,
          name: profile.username,
          image: profile.avatar
            ? "https://cdn.discordapp.com/avatars/" +
              account.id +
              "/" +
              profile.avatar +
              ".webp"
            : "assets/img/discord_placeholder.png",
          email: profile.email,
        };

        if (account) {
          const guilds = await util.getUserDiscordGuilds(account.accessToken);
          await util.updateGuilds(prisma, uid, guilds);
        }
      }

      return Promise.resolve(token);
    },

    // @ts-ignore
    session: async (session, user) => {
      session.user = user;
      return Promise.resolve(session);
    },
  },
};

// @ts-ignore
export default (req, res) => NextAuth(req, res, options);
