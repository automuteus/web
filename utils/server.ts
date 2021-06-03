export async function getUserDiscordGuilds(token) {
  const bearer = `Bearer ${token}`;
  const guild = await fetch("https://discordapp.com/api/users/@me/guilds", {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  });

  return guild.json();
}

export async function updateGuilds(prisma: any, uid: any, guilds: any) {
  console.log("Updating guilds for user:", uid);
  const gids: Array<number> = guilds.map((g: any) => Number(g.id));

  await prisma.usersGuild.updateMany({
    where: { user_id: uid, guild_id: { notIn: gids } },
    data: {
      active: false,
    },
  });

  const done = guilds.map(async (g: any) => {
    try {
      await prisma.user.update({
        where: { id: uid },
        data: {
          users_guilds: {
            connectOrCreate: {
              where: {
                user_id_guild_id: {
                  user_id: uid,
                  guild_id: g.id,
                },
              },
              create: {
                active: true,
                permissions: g.permissions_new,
                guilds: {
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
      console.log("user", uid);
    }
  });
}
