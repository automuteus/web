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
      query: { guildId },
    } = req,
    gid = parseInt(guildId);

  switch (method) {
    case "GET":
      res.json({ message: "unimplemented GET", gid: gid });
      break;
    case "POST":
      res.json({ message: "unimplemented POST" });
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
