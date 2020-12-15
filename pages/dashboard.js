import { useSession, getSession } from "next-auth/client";
import { motion } from "framer-motion";
import Layout from "../components/layout";
import Guild from "../components/guild";
import { useState } from "react";

export default function Page(props) {
  const [session, loading] = useSession();
 const [guilds, setGuilds] = useState(session.guilds);

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return (
      <Layout innerClassName="justify-content-center">
        <h1>Access Denied</h1>
        <p>Please sign in to view this page.</p>
      </Layout>
    );
  }

  let guild_render;
  if (session && session.guilds && typeof session.guilds === "object") {
    try {
      guild_render = session.guilds
        .map((g) => <Guild guild={g} type="card-sm" key={g.id} />)
        .sort((a, b) => (a.name > b.name ? 1 : -1));
      guild_render = (
        <div className="d-flex flex-row flex-wrap">{guild_render}</div>
      );
    } catch (error) {
      console.log("the fuck");
    }
  }

  return (
    <>
      <Layout innerClassName="datapage" effect={false}>
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          {/* <h1>Bot Dashboard</h1>
          <p>
            You can manage settings related to your bot here. As we make more
            settings, you'll have more options!
          </p> */}
          <h3>Guilds</h3>
          {guild_render}
          {/* <pre style={{ color: "white", maxHeight: "10em" }}>
            {JSON.stringify(session, null, 2)}
          </pre> */}
        </motion.div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const guilds = session.guilds;
  return {
    props: { session, guilds },
  };
}
