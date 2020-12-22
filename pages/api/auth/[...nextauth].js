import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";

import { PrismaClient } from "@prisma/client";

import * as util from "../../../components/utilities";

let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
// }

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
    },
  }),

  session: {
    jwt: true,
  },

  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        token = {
          id: user.id,
          name: profile.username,
          image:
            "http://cdn.discordapp.com/avatars/" +
            profile.id +
            "/" +
            profile.avatar +
            ".png",
          email: profile.email,
        };

        const guilds = await util.getUserDiscordGuilds(user.accessToken);
        guilds.map(async (g) => {
          const tmp = await prisma.guild.upsert({
            where: { guild_id: g.id },
            update: { name: g.name, icon: g.icon },
            create: {
              name: g.name,
              guild_id: g.id,
              icon: g.icon,
              premium: 0,
            },
          });
        });
      }

      return Promise.resolve(token);
    },

    session: async (session, user) => {
      // console.log("user", user);
      // console.log("session", session);

      session.user = user;
      return Promise.resolve(session);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
