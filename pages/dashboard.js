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
      .map((g) => (
        <Guild key={g.guilds.guild_id} guild={g.guilds} type="list" />
      ));
  } else {
    guilds = <code>Could not fetch server list.</code>;
  }

  return (
    <>
      <Layout
        outerClassName="theatric"
        innerClassName="justify-content-center"
        effect={true}
      >
        <Head>
          {/* HTML Meta Tags */}
          <title>AutoMuteUs</title>
          <meta
            name="description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta name="theme-color" content="#7289DA" />

          {/* Google / Search Engine Tags */}
          <meta itemProp="name" content="AutoMuteUs" />
          <meta
            itemProp="description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            itemProp="image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />

          {/* Discord/Facebook Meta Tags */}
          <meta property="og:url" content="http://automute.us" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="AutoMuteUs" />
          <meta
            property="og:description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            property="og:image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />

          {/* Twitter Meta Tags */}
          <meta name="twitter:title" content="AutoMuteUs" />
          <meta
            name="twitter:description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            name="twitter:image"
            content="http://raw.githubusercontent.com/automuteus/react-web/main/public/assets/img/logo_embed.png"
          />
        </Head>
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          className="d-flex flex-column w-100 justify-content-center align-items-center"
        >
          <h1>This page was an impostor.</h1>
          <h5>(Sorry, but this page doesn't actually exist)</h5>
        </motion.div>
      </Layout>
    </>
  );

  // return (
  //   <>
  //     <Layout effect={false}>
  //       <Head>
  //         <title>Bot Dashboard</title>
  //       </Head>
  //       <motion.div
  //         exit={{ opacity: 0 }}
  //         animate={{ opacity: 1 }}
  //         initial={{ opacity: 0 }}
  //       >
  //         <div className="dashboard-header">
  //           <h1>Bot Dashboard</h1>
  //           <p>
  //             You can manage settings related to your bot here. As we make more
  //             settings, you'll have more options!
  //           </p>
  //         </div>
  //         <Row xs="1">
  //           <Col lg="4">
  //             <h3>Manage Servers</h3>
  //             <div>{isLoading && !isError ? loading_icon : guilds}</div>
  //           </Col>
  //           <Col lg="8" />
  //         </Row>
  //       </motion.div>
  //     </Layout>
  //   </>
  // );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session },
  };
}
