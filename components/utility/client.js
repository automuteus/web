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

export function compareAlph(a, b, field) {
  let ga, gb;
  if (a[field]) {
    ga = a[field].toUpperCase();
    gb = b[field].toUpperCase();
  } else {
    ga = a.guilds[field].toUpperCase();
    gb = b.guilds[field].toUpperCase();
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

  return [data, !error && !data, error || data === undefined];
}

export function listUserGuildsAdmin(uid) {
  const { data, error } = useSWR("/api/guilds/" + uid + "/admin", fetcher);

  return [data, !error && !data, error || data === undefined];
}

export function getGuildSettings(gid) {
  const { data, error } = useSWR("/api/settings/" + gid, fetcher);

  return {
    data: data,
    loading: !error && !data,
    error: error || data === undefined,
  };
}

export const popupCenter = ({ url, title, w, h }) => {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow = window.open(
    url,
    title,
    `
    scrollbars=yes,
    width=${w / systemZoom}, 
    height=${h / systemZoom}, 
    top=${top}, 
    left=${left}
    `
  );

  if (window.focus) newWindow.focus();
};
