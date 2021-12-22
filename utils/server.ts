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

  // Mark current user-guild associations as inactive
  await prisma.guildsOnUsers.updateMany({
    where: { userId, guildId: { notIn: gids } },
    data: {
      active: false,
    },
  });

  try {
    guilds.map(async (g) => {
      // Update guild details
      await prisma.guild.upsert({
        where: { guild_id: g.id },
        update: {
          name: g.name,
          icon: g.icon,
        },
        create: {
          guild_id: g.id,
          name: g.name,
          icon: g.icon,
          premium: 0,
        },
      });

      // Update association
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
    });
  } catch {
    return false;
  }

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
