import Head from "next/head";
import { getSession } from "next-auth/client";
import { motion } from "framer-motion";
import { Col, Row, Spinner } from "react-bootstrap";

import Layout from "../components/layout";
import Guild from "../components/guild";
import * as util from "../components/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import { PrismaClient } from "@prisma/client";

export default function Dashboard({ content, session }) {
  console.log(content);

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
      .map((g) => <Guild key={g.id} guild={g} />);
  } else {
    guild_render = (
      <pre style={{color: "white", height: "20em"}}>
        {content}
      </pre>
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
              <div style={{ maxHeight: "100%", overflow: "auto" }}>
                {guild_render}
              </div>
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
  const guilds = await fetch(`http://localhost:3000/api/guilds`, {
    method: "GET",
  });

  const content = await guilds.json();

  return {
    props: { session, content },
  };
}
