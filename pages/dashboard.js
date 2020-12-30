import Head from "next/head";
import { getSession } from "next-auth/client";
import { motion } from "framer-motion";
import { Col, Row, Spinner } from "react-bootstrap";

import Layout from "../components/layout";
import Guild from "../components/guild";
import SigninRequired from "../components/signin-required";
import * as util from "../components/utility/client";

export default function Dashboard({ session }) {
  if (!session) {
    return <SigninRequired rediret="/dashboard" />;
  }
  const { user_guilds, isLoading, isError } = util.listUserGuilds(
    session.user.id
  );

  let loading_icon = (
    <div className="d-flex align-items-center">
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <strong className="ml-2">Loading servers...</strong>
    </div>
  );

  let guilds = null;

  if (Array.isArray(user_guilds)) {
    guilds = user_guilds
      .sort(util.compareGuilds)
      .map((g) => <Guild key={g.guilds.guild_id} guild={g.guilds} type="list" />);
  } else {
    guilds = <code>Could not fetch server list.</code>;
  }

  return (
    <>
      <Layout effect={false}>
        <Head>
          <title>Bot Dashboard</title>
        </Head>
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <div className="dashboard-header">
            <h1>Bot Dashboard</h1>
            <p>
              You can manage settings related to your bot here. As we make more
              settings, you'll have more options!
            </p>
          </div>
          <Row xs="1">
            <Col lg="4">
              <h3>Manage Servers</h3>
              <div>{isLoading && !isError ? loading_icon : guilds}</div>
            </Col>
            <Col lg="8" />
          </Row>
        </motion.div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
