import { NextApiRequest, NextApiResponse } from "next";

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({ statusCode: 200, message: "ok", timestamp: new Date() });
};

export default handler;
