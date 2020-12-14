import jwt from "next-auth/jwt";

const secret = process.env.JWT_SECRET;

export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}

export default example = async (req, res) => {
  const token = await jwt.getToken({ req, secret });
  console.log("JSON Web Token", token);
  res.end();
};
