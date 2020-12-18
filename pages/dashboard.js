import Head from "next/head";
import { getSession } from "next-auth/client";
import { motion } from "framer-motion";
import { Col, Row, Spinner } from "react-bootstrap";

import Layout from "../components/layout";
import Guild from "../components/guild";
import * as util from "../components/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({ content, session }) {
  if (!session) {
    return (
      <Layout innerClassName="justify-content-center">
        <h1>Access Denied</h1>
        <p>Please sign in to view this page.</p>
      </Layout>
    );
  }

  let guild_render = (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );

  // guild_render = <pre style={{color: "white"}}>{JSON.stringify(content, null, 2)}</pre>;
  if (Array.isArray(content)) {
    guild_render = content
      .sort(util.compareGuilds)
      .map((g) => <Guild key={g.id} guild={g}></Guild>);
  } else {
    guild_render = (
      <div className="alert alert-warning">
        <FontAwesomeIcon icon={faExclamationTriangle} /> Discord seems to be
        rate limiting us - please refresh your page!
      </div>
    );
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
              <div style={{maxHeight: "100%", overflow: "auto"}}>{guild_render}</div>
            </Col>
            <Col lg="8"></Col>
          </Row>
        </motion.div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  let content = [];

  if (session && session.guilds === undefined) {
    content = await util.getUserGuilds(session.token);
  }

  return {
    props: { session, content },
  };
}
