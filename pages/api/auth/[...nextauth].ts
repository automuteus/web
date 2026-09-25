import NextAuth from "next-auth";
import { authOptions } from "../../../utils/server/auth";

export { authOptions };
export default NextAuth(authOptions);
