require("dotenv").config();
import NextAuth from "next-auth";
import { encode } from "next-auth/jwt";
import Providers from "next-auth/providers";

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      scope: "identify email guilds",
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.username,
          image: "https://cdn.discordapp.com/avatars/"
            .concat(profile.id, "/")
            .concat(profile.avatar, ".png"),
          email: profile.email,
          verified: profile.verified,
        };
      },
    }),
  ],
  
  database: process.env.DATABASE_URL,

  callbacks: {
    // jwt: async (token, user, account, profile, isNewUser) => {
    //   const isSignIn = user ? true : false;
    //   token.profile = profile;
    //   // if (isSignIn) {
    //   //   const guilds = getUserGuilds(account);
    //   //   profile.guilds = encode(guilds);
    //   // }
    //   if (isSignIn) {
    //     // token.auth_time = Math.floor(Date.now() / 1000);
    //     // token.verified = profile.verified;
    //     // token.guilds = null;
    //     console.log("SI/profile", profile);
    //     console.log("SI/token", token);
    //   } else {
    //     console.log("profile", profile);
    //     console.log("token", token);
    //   }
    //   return Promise.resolve(token);
    // },

    session: async (session, user) => {
      console.log("user", user);
      console.log("session", session)
      return Promise.resolve(session);
    },
  },

  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
};

function getUserGuilds(account) {
  const bearer = `Bearer ${account.accessToken}`;
  return fetch("https://discordapp.com/api/users/@me/guilds", {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
}

export default (req, res) => NextAuth(req, res, options);
