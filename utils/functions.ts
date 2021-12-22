export function validGuild(gid: any) {
  return !isNaN(gid) && gid !== "0" && gid.length >= 17 && gid.length <= 20;
}

export const compareGuilds = (a: any, b: any) => {
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
};

export const compareAlph = (a: any, b: any, field: string) => {
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
};

export const popupCenter = ({
  url,
  title,
  w,
  h,
}: {
  url: string;
  title: string;
  w: number;
  h: number;
}) => {
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

  //@ts-ignore
  if (window.focus) newWindow.focus();
};
