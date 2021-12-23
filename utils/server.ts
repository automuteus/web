import { prisma } from "../db";

export async function fetchDiscordGuilds(token: string) {
  const bearer = `Bearer ${token}`;
  const guilds = await fetch("https://discordapp.com/api/users/@me/guilds", {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());

  return guilds;
}

export async function updateCachedGuilds(userId: string, guilds: any[]) {
  const gids = guilds.map((g) => g.id);
  console.log("Updating guilds for user:", userId);

  await prisma.guildsOnUsers.updateMany({
    where: { userId: userId, guildId: { notIn: gids } },
    data: {
      active: false,
    },
  });

  const done = guilds.map(async (g: any) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          guilds: {
            connectOrCreate: {
              where: {
                userId_guildId: {
                  userId: userId,
                  guildId: g.id,
                },
              },
              create: {
                active: true,
                permissions: g.permissions_new,
                guild: {
                  connectOrCreate: {
                    where: { guild_id: g.id },
                    create: {
                      guild_id: g.id,
                      name: g.name,
                      icon: g.icon,
                      premium: 0,
                    },
                  },
                },
              },
            },
          },
        },
      });

      await prisma.guild.update({
        where: { guild_id: g.id },
        data: {
          name: g.name,
          icon: g.icon,
        },
      });
    } catch (err) {
      console.log("--------------------");
      console.log("Error: ", err);
      console.log("guild", g);
      console.log("user", userId);
    }
  });
  return guilds;
}

export async function retrieveCachedGuilds(userId: string) {
  return await prisma.guild.findMany({
    where: {
      users: {
        every: {
          userId,
          active: true,
        },
      },
    },
  });
}
