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

  console.log("Updating guilds for user:", uid);
  guilds.map(async (g) => {
    try {
      await prisma.usersGuild.upsert({
        where: {
          user_id_guild_id: {
            user_id: uid,
            guild_id: g.id,
          },
        },
        create: {
          users: { connect: { id: uid } },
          guilds: {
            connectOrCreate: {
              where: { guild_id: g.id },
              create: {
                name: g.name,
                guild_id: g.id,
                icon: g.icon,
                premium: 0,
              },
            },
          },
          active: true,
        },
        update: { active: true },
      });
    } catch (err) {
      console.log("--------------------");
      console.log("Error: ", err);
      console.log("guild", g);
      console.log("user", user);
    }
  });
}
