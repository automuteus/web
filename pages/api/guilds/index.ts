export default async function handler(
  req: { method: any },
  res: {
    json: (arg0: { status: number; message: string }[]) => void;
    setHeader: (arg0: string, arg1: string[]) => void;
    status: (arg0: number) => {
      (): any;
      new (): any;
      end: { (arg0: string): void; new (): any };
    };
  }
) {
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
