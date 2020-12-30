import { getSession } from "next-auth/client";
import * as util from "../../../components/utility/server";

import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      res.json([{ status: 204, message: "OK" }]);
      break;
    case "POST":
      res.json([{ status: 204, message: "OK" }]);
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
