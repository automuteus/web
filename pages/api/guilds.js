import { getSession } from "next-auth/client";
import * as util from "../../components/server_utils";

import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const guilds = await prisma.guild.findMany();
    res.json(guilds);
  }
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
