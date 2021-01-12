import { getSession } from "next-auth/client";
import * as util from "../../../components/utility/server";

import { PrismaClient } from "@prisma/client";
import { PrismaClient as BotPrismaClient } from "../../../prisma/src/generated/bot";

const bosma = new BotPrismaClient();

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
