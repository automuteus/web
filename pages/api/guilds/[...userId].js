
import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default async function handler(req, res) {
  const {
      method,
      query: { userId },
    } = req,
    uid = parseInt(userId[0]),
    type = userId[1] ?? "all";

  switch (method) {
    case "GET":
      console.log("Fetching guild list (type: " + type + ") for user:", uid);
      const guilds = await prisma.user
        .findUnique({ where: { id: uid } })
        .users_guilds({
          where: {
            active: true
          },
          include: {
            guilds: true,
          },
        });

      const ret =
        type == "admin"
          ? guilds.filter((g) => (parseInt(g.permissions) & 0x20) == 0x20)
          : guilds;

      res.json(ret);
      break;
    case "POST":
      res.json({ message: "unimplemented POST" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}