import React from "react";
import Head from "next/head";


import Layout from "../components/layout";

export default class ErrorPage extends React.Component {
  render() {
    return (
      <Layout
        className="theatric"
        innerClassName="justify-content-center align-items-center flex-column"
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
            content="http://automute.us/assets/img/logo_embed.png"
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
            content="http://automute.us/assets/img/logo_embed.png"
          />

          {/* Twitter Meta Tags */}
          <meta name="twitter:title" content="AutoMuteUs" />
          <meta
            name="twitter:description"
            content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          />
          <meta
            name="twitter:image"
            content="http://automute.us/assets/img/logo_embed.png"
          />
        </Head>
        <h1>This page was an impostor.</h1>
        <h5>(Sorry, but this page doesn't actually exist)</h5>
      </Layout>
    );
  }
}
