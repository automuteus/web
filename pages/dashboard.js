export const thisIsAnUnusedExport =
  "this export only exists to disable fast refresh for this file";

import { getSession } from "next-auth/client";
import { motion } from "framer-motion";
import Layout from "../components/layout";
import { Col, Row, Spinner } from "react-bootstrap";

export default function Page({ content, session }) {
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

  guild_render = <pre style={{color: "white"}}>{JSON.stringify(content, null, 2)}</pre>;
  

  return (
    <>
      <Layout effect={false}>
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
              <h3>Guilds</h3>
            </Col>
            <Col lg="8">{guild_render}</Col>
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
    console.log("Fetching guilds...")
    content = await getUserGuilds(session.token);
  }

  return {
    props: { session, content },
  };
}

async function getUserGuilds(token) {
  const bearer = `Bearer ${token}`;
  const guild = await fetch("https://discordapp.com/api/users/@me/guilds", {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
  });

  return guild.json();
}