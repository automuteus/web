import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "../../../lib/prisma";
import { Guild } from "@prisma/client";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET,
            authorization:
                "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds&response_type=code&prompt=consent",
            profile(profile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber =
                        parseInt(profile.discriminator) % 5;
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
                } else {
                    const format = profile.avatar.startsWith("a_")
                        ? "gif"
                        : "png";
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
                }

                process.stdout.write(`[DEBUG] Fetching user guilds...`);
                const startTime = Date.now();
                prisma.account
                    .findFirst({
                        where: {
                            providerAccountId: profile.id,
                        },
                    })
                    .then(async (account) => {
                        const bearer = `Bearer ${account.access_token}`;
                        const guild_list = await fetch(
                            "https://discordapp.com/api/users/@me/guilds",
                            {
                                method: "GET",
                                credentials: "include",
                                headers: {
                                    Authorization: bearer,
                                    "Content-Type": "application/json",
                                },
                            }
                        ).then((res) => res.json());

                        const guilds: Array<Guild> = guild_list.map(
                            (g: Guild) =>
                                ({
                                    id: g.id,
                                    name: g.name,
                                    permissions: g.permissions.toString(),
                                    icon: g.icon ?? null,
                                } as Guild)
                        );

                        await prisma.user.update({
                            where: { id: account.userId },
                            data: {
                                guilds: {
                                    connectOrCreate: guilds.map((g) => ({
                                        where: {
                                            id: g.id,
                                        },
                                        create: g,
                                    })),
                                },
                            },
                        });

                        process.stdout.write(
                            `\tdone for ${profile.username}. (${
                                guilds.length
                            } guilds/${(Date.now() - startTime) / 1000}s)\n`
                        );
                    });

                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    image: profile.image_url,
                    me: "oh"
                };
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
