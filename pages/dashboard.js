import Head from "next/head";
import { getSession } from "next-auth/client";
import { motion } from "framer-motion";
import { Col, Row, Spinner } from "react-bootstrap";

import Layout from "../components/layout";
import Guild from "../components/guild";
import SigninRequired from "../components/signin-required";
import * as util from "../components/utility/client";

export default function Dashboard({ content, session }) {
  if (!session) {
    return <SigninRequired rediret="/dashboard" />;
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
      .map((g) => <Guild key={g.guilds.id} guild={g.guilds} />);
  } else {
    guild_render = <code>Could not fetch server list.</code>;
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
              {/* <Button className="btn-secondary" onClick={alert()}>
                <FontAwesomeIcon icon={faSync} className="mr-2" /> Refresh
                Servers
              </Button> */}
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

  let content = null;
  if (session && session.user) {
    const guilds = await util.getStoredGuilds(session);

    content = await guilds.json().catch(() => {
      return null;
    });
  }

  if (!Array.isArray(content)) content = null;

  return {
    props: { session, content },
  };
}
