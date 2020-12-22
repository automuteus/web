import React from "react";
import Head from "next/head";

import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faCamera, faGem } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

import Layout from "../components/layout";
import ServerStats from "../components/server-stats";
import Link from "next/link";

export default class App extends React.Component {
  render() {
    return (
      <Layout outerClassName="theatric" innerClassName="justify-content-center" effect={true}>
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
    );
  }
}