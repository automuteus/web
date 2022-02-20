import { NextApiHandler } from "next";
import NextAuth, { Account, NextAuthOptions, Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "../../../lib/prisma";
import { Guild } from "@prisma/client";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options: NextAuthOptions = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization:
                "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds&response_type=code&prompt=consent",
        }),
    ],
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: "jwt",
    },

    secret: process.env.SECRET,

    callbacks: {
        async session({ session, token }) {
            session.user = { ...session.user, ...token };
            return session;
        },
        async jwt({ token, user, account }) {
            if (account && user) updateGuilds(account, user);
            if (user) token.id = user.id;
            return token;
        },
    },
};

async function updateGuilds(account: Account, user: User) {
    const startTime = Date.now();
    const bearer = `Bearer ${account.access_token}`;

    // Guilds user is in from Discord
    const discordGuilds: Array<Guild> = await fetch(
        "https://discordapp.com/api/users/@me/guilds",
        {
            method: "GET",
            credentials: "include",
            headers: {
                Authorization: bearer,
                "Content-Type": "application/json",
            },
        }
    )
        .then((res) => res.json())
        .then((json) =>
            json.map((g: Guild) => ({
                id: g.id,
                name: g.name,
                permissions: g.permissions.toString(),
                icon: g.icon ?? null,
            }))
        );

    // Guilds currently connected to user
    const storedGuilds = await prisma.user
        .findUnique({
            where: { id: user.id },
            include: { guilds: true },
        })
        .then((user) => user.guilds);

    // Disconnect these guilds from user
    const remGuilds = storedGuilds.filter(
        (g) => !discordGuilds.some((v) => v.id === g.id)
    );

    // Update details of these guilds
    const oldGuilds = storedGuilds.filter((g) =>
        discordGuilds.some((v) => v.id === g.id)
    );

    // Create new of these guilds
    const newGuilds = discordGuilds.filter(
        (g) => !storedGuilds.some((v) => v.id === g.id)
    );

    await prisma.user.update({
        where: { id: user.id },
        data: {
            guilds: {
                disconnect: remGuilds.map((g) => ({
                    id: g.id,
                })),
                upsert: discordGuilds.map((g) => ({
                    where: {
                        id: g.id,
                    },
                    create: g,
                    update: g,
                })),
            },
        },
    });

    console.log(
        "\x1b[33m%s\x1b[0m",
        `[DEBUG@${new Date(
            startTime
        ).toLocaleString()}] Guild update done for ${user.name}. (+${
            newGuilds.length
        }/-${remGuilds.length}/~${oldGuilds.length}/${
            (Date.now() - startTime) / 1000
        }s)\n`
    );
}
