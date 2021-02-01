import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import { PrismaClient } from "@prisma/client";

import * as util from "../../../components/utility/server";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

const options = {
  debug: false,

  secret: process.env.SECRET,

  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify email guilds",
    }),
  ],

  adapter: Adapters.Prisma.Adapter({
    prisma,
    modelMapping: {
      User: "user",
      Account: "account",
      Session: "session",
      VerificationRequest: "verificationRequest",
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
    jwt: async (token, user, account, profile, isNewUser) => {
      if (account && user) {
        const uid = isNewUser ? user.id : user.userId;
        const ext = ".png"; // Eventually check if an animated image exists and use .gif

        let img = profile.avatar
          ? "https://cdn.discordapp.com/avatars/" +
            profile.id +
            "/" +
            profile.avatar +
            ext
          : "https://upload.wikimedia.org/wikipedia/commons/9/90/Discord-512.webp";

        token = {
          id: uid,
          name: profile.username,
          image: img,
          email: profile.email,
        };

        if (account) {
          const guilds = await util.getUserDiscordGuilds(account.accessToken);
          await util.updateGuilds(prisma, uid, guilds);
        }
      }

      return Promise.resolve(token);
    },

    session: async (session, user) => {
      session.user = user;
      return Promise.resolve(session);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
