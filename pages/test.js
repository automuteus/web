import Layout from "../components/layout";
import * as util from "../components/utility/client";

export default function Tmp() {
  const { data, isLoading, isError } = util.listUserGuilds(8);

  if (isError) return <Layout>failed to load</Layout>;
  if (isLoading) return <Layout>loading...</Layout>;

  return (
    <Layout>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Layout>
  );
}