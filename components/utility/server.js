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

export async function updateGuilds(prisma, uid, guilds) {
  console.log("Updating guilds for user:", uid);
  const t0 = Date.now();
  const updateAll = () => {
    return Promise.all(guilds.map((g) => updateGuild(g, uid)));
  };

  updateAll().then(() => {
    const t1 = Date.now();
    console.log("\t... guilds updated for user:", uid, "in", (t1 - t0), "ms");
  });
}

async function updateGuild(g, uid) {
  try {
    await prisma.guild.updateMany({
      where: { guild_id: g.id },
      data: {
        name: g.name,
        icon: g.icon,
      },
    });

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
}
