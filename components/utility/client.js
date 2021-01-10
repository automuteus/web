import useSWR from "swr";
const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function validGuild(gid) {
  return !isNaN(gid) && gid !== 0 && gid.length >= 17 && gid.length <= 20;
}

export async function getStoredGuilds(session) {
  console.log("Fetching guilds...");
  return await fetch(process.env.NEXTAUTH_URL + `/api/guilds/`, {
    method: "POST",
    body: JSON.stringify(session),
  });
}

export function compareGuilds(a, b) {
  let ga, gb;
  if (a.name) {
    ga = a.name.toUpperCase();
    gb = b.name.toUpperCase();
  } else {
    ga = a.guilds.name.toUpperCase();
    gb = b.guilds.name.toUpperCase();
  }

  let cmp = 0;
  if (ga > gb) {
    cmp = 1;
  } else if (ga < gb) {
    cmp = -1;
  }
  return cmp;
}

export function listUserGuilds(uid) {
  const { data, error } = useSWR("/api/guilds/" + uid, fetcher);

  return {
    user_guilds: data,
    isLoading: !error && !data,
    isError: error || data === undefined,
  };
}

export function listUserGuildsAdmin(uid) {
  const { data, error } = useSWR("/api/guilds/" + uid + "/admin", fetcher);

  return {
    user_guilds: data,
    isLoading: !error && !data,
    isError: error || data === undefined,
  };
}
