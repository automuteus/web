export async function getUserDiscordGuilds(token) {
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

export async function updateGuilds(prisma, user, guilds) {
  const uid = user.id;
  console.log(uid);

  console.log("Updating guilds for user:", uid);
  guilds.map(async (g) => {
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
    } catch (err) {
      console.log("--------------------");
      console.log("Error: ", err);
      console.log("guild", g);
      console.log("user", user);
    }
  });
}
