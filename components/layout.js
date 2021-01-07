import Head from "next/head";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";

import Header from "./header";
import Footer from "./footer";

export default function Layout(props) {
  return (
    <Container fluid className={`main_container ${props.className}`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>AutoMuteUs</title>
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
      <Footer effect={props.effect} effectActive={props.effectActive} />
    </Container>
  );
}
