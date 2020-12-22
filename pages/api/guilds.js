import { PrismaClient } from "@prisma/client";

let prisma;

// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient();
// } else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
// }

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { body } = req;
    const guilds = await prisma.guild.findMany();
    res.json(guilds);
  }
}
