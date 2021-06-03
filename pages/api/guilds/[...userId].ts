import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
      method,
      query: { userId },
    } = req,
    uid = parseInt(userId[0]),
    type = userId[1] ?? "all";

  switch (method) {
    case "GET":
      console.log("Fetching guild list (type: " + type + ") for user:", uid);
      const guilds = await prisma.usersGuild.findMany({
        where: { user_id: uid, active: false },
        include: {
          guilds: true
        }
      });

      const ret =
        type == "admin"
          ? guilds.filter((g: any) => (parseInt(g.permissions) & 0x20) == 0x20)
          : guilds;

      res.status(200).json(ret);
      break;
    case "POST":
      res.status(200).json({ message: "unimplemented POST" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
