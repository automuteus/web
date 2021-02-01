import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signIn } from "next-auth/client";
import Layout from "./layout";

export default function SigninRequired(props) {
  return (
    <Layout innerClassName="justify-content-center align-items-center">
      <div className="text-center">
        <h1>Access Denied</h1>
        <p>Please sign in to view this page.</p>

        <div
          className="d-block btn btn-primary mr-0 mt-2 mb-2"
          onClick={() =>
            signIn("discord", {
              callbackUrl: process.env.NEXTAUTH_URL + props.redirect,
            })
          }
        >
          <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
          Sign In
        </div>
      </div>
    </Layout>
  );
}
