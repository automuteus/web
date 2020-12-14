import NextAuth from "next-auth";
import { encode, getToken } from "next-auth/jwt";
import Providers from "next-auth/providers";

const options = {
  debug: false,
  database: process.env.DATABASE_URL,

  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify email guilds",
    }),
  ],

  session: {
    jwt: true,
  },

  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      console.clear();
      console.log("\n\n");
      if (account) {
        profile.token = account.accessToken;
        token.profile = profile;
      }
      return Promise.resolve(token);
    },

    session: async (session, user) => {
      if (user.profile.token) {
        session.guilds = await getUserGuilds(user.profile.token);
      }
      session.token = user.profile.token;
      return Promise.resolve(session);
    },
  },

  // A database is optional, but required to persist accounts in a database
};

async function getUserGuilds(token) {
  const bearer = `Bearer ${token}`;
  const guild = await fetch("https://discordapp.com/api/users/@me/guilds", {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  });

  return guild.json();
}

export default (req, res) => NextAuth(req, res, options);
