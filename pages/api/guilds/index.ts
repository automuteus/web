import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

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
}
