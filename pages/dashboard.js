import { useSession, getSession } from "next-auth/client";
import { motion } from "framer-motion";
import Layout from "../components/layout";

export default function Page() {
  const [session, loading] = useSession();

  if (typeof window !== "undefined" && loading) return null;

  if (!session) {
    return (
      <Layout innerClassName="justify-content-center">
        <h1>Access Denied</h1>
        <p>Please sign in to view this page.</p>
      </Layout>
    );
  }

  return (
    <>
      <Layout innerClassName="datapage" effect={false}>
        <motion.div
          exit={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <h1>Bot Dashboard</h1>
          <p>You can manage settings related to your bot here. As we make more settings, you'll have more options!</p>
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
