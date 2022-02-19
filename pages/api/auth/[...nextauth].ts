import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import prisma from "../../../lib/prisma";

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
                console.log(profile);

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
                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    image: profile.image_url,
                };
            },
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
};
