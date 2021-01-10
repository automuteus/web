import { getSession } from "next-auth/client";
import * as util from "../../../components/utility/server";

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
          include: {
            guilds: true,
          },
        });

      const ret =
        type == "admin"
          ? guilds.filter((g) => (parseInt(g.permissions) & 0x8) == 0x8)
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

  // let body = null;
  // if (req.method === "POST" && (body = JSON.parse(req.body))) {
  //   const guilds = await prisma.usersGuild.findMany({
  //     where: { user_id: body.user_id },
  //     include: {
  //       guilds: true,
  //     },
  //   });
  //   res.json(guilds);
  // }

  // res.end();
}

// export default async (req, res) => {
//   const session = await getSession({ req });

//   if (session) {
//     if (req.method === "GET") {
//       const guilds = await prisma.guild.findMany();
//       res.json(guilds);
//     }
//   } else {
//     res.send({
//       error: "You must be sign in to view the protected content on this page.",
//     });
//   }
// };
