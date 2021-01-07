import Head from "next/head";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";

import Header from "./header";
import Footer from "./footer";
import styles from "./layout.module.css";

export default function Layout({ children, home }) {
  return (
    <Container fluid className={styles.main_container}>
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
        className=" d-flex flex-lg-row flex-column align-items-center p-3"
      >
        {children}
      </motion.main>
      <Footer />
    </Container>
  );
}
