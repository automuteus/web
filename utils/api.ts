import * as AMUS from "./interfaces";

export async function getStoredGuilds(session: any) {
  // console.log("Fetching guilds...");
  return await fetch(process.env.NEXTAUTH_URL + `/api/guilds/`, {
    method: "POST",
    body: JSON.stringify(session),
  });
}

export const listUserGuilds = async (
  uid: string,
  filter?: string
): Promise<Array<AMUS.Guild>> => {
  const route = "/api/guilds/" + uid + (filter ? "?" + filter : "");
  const res = await fetch(route);
  const data = await res.json();

  return data;
};

export const getServerStats = async (): Promise<AMUS.ServerStats> => {
  const route = "https://galactus.automute.us/";
  const res = await fetch(route);
  const data = await res.json();
  return data as AMUS.ServerStats;
};

// export function getGuildSettings(gid: string) {
//   const { data, error } = useSWR("/api/settings/" + gid, fetcher);

//   return {
//     data: data,
//     loading: !error && !data,
//     error: error || data === undefined,
//   };
// }
