import Head from "next/head";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";

import Header from "./header";
import Footer from "./footer";

export default function Layout(props) {
  return (
    <Container fluid className={`main_container ${props.className}`}>
      <Head>
        {/* HTML Meta Tags */}
        <title>AutoMuteUs</title>
        <meta
          name="description"
          content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
        />
        <meta name="theme-color" content="#7289DA" />

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content="AutoMuteUs" key="google:name" />
        <meta
          itemProp="description"
          content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          key="google:description"
        />
        <meta
          itemProp="image"
          content={`https://automute.us/assets/img/logo_embed.png`}
          key="google:image"
        />

        {/* Discord/Facebook Meta Tags */}
        <meta
          property="og:url"
          content="https://automute.us"
          key="og:url"
        />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:title" content="AutoMuteUs" key="og:title" />
        <meta
          property="og:description"
          content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
          key="og:description"
        />
        <meta
          property="og:image"
          content={`https://automute.us/assets/img/logo_embed.png`}
          key="og:image"
        />

        {/* Twitter Meta Tags */}
        <meta name="twitter:title" content="AutoMuteUs" />
        <meta
          name="twitter:description"
          content="AutoMuteUs is a Discord Bot that collects Among Us game data to automatically mute/unmute players during games!"
        />
        <meta
          name="twitter:image"
          content={`https://automute.us/assets/img/logo_embed.png`}
        />
      </Head>

      <Header />
      <motion.main
        exit={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        id="main-content"
        className={`d-flex p-3 ${props.innerClassName}`}
      >
        {props.children}
      </motion.main>
      <Footer />
    </Container>
  );
}
