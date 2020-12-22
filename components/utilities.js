export async function getUserDiscordGuilds(token) {
  console.log("Fetching guilds from Discord...");
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

export async function getStoredGuilds(db) {
  console.log("Fetching cached guilds...");
  // const guilds = await fetch(`http://localhost/guilds`, {
  //   method: "POST",
  // });
  
  return guilds.json();
}

export function compareGuilds(a, b) {
  const ga = a.name.toUpperCase();
  const gb = b.name.toUpperCase();

  let cmp = 0;
  if (ga > gb) {
    cmp = 1;
  } else if (ga < gb) {
    cmp = -1;
  }
  return cmp;
}
