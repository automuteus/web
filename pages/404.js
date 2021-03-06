import React from "react";
import Head from "next/head";

import Layout from "../components/common/layout";

export default class ErrorPage extends React.Component {
  render() {
    return (
      <Layout
        className="theatric"
        innerClassName="justify-content-center align-items-center flex-column"
        effect={true}
      >
        <Head>
          <title>Page Not Found | AutoMuteUs</title>
        </Head>
        <h1>This page was an impostor.</h1>
        <h5>(Sorry, but this page doesn't actually exist)</h5>
      </Layout>
    );
  }
}
