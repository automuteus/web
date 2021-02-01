import React from "react";
import Head from "next/head";

import Layout from "../../components/common/layout";
import { Button } from "react-bootstrap";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";
import { signIn } from "next-auth/client";

export default class ErrorPage extends React.Component {
  render() {
    return (
      <Layout
        className="theatric"
        innerClassName="justify-content-center align-items-center flex-column"
        effect={false}
      >
        <Head>
          <title>Authorization Error | AutoMuteUs</title>
        </Head>
        <h1>Sign-in Error or Cancellation</h1>
        <h5>
          Either try to
          <span
            onClick={() =>
              signIn("discord", { callbackUrl: "/" })
            }
          >
            <Button className="btn px-2 py-2 mx-3">
              <FontAwesomeIcon icon={faDiscord} size="lg" className="mr-2" />
              <span>Sign In</span>
            </Button>
          </span>
          again, or
          <Link href="/">
            <Button className="btn px-2 py-2 mx-3">
              <FontAwesomeIcon icon={faHome} size="lg" className="mr-2" />
              <span>Go Home</span>
            </Button>
          </Link>
        </h5>
      </Layout>
    );
  }
}
