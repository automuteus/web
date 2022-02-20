import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
      method,
      query: { userId },
    } = req,
    uid = userId[0],
    type = userId[1] ?? "all";

  switch (method) {
    case "GET":
      console.log("Fetching guild list (type: " + type + ") for user:", uid);
      const guilds = await prisma.guild.findMany({
        where: {
          users: {
            every: {
              userId: uid,
              active: true,
            },
          },
        },
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
