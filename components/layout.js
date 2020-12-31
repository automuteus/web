import Head from "next/head";
import { Container } from "react-bootstrap";

import Header from "./header";
import Footer from "./footer";
import styles from "./layout.module.css";

export default function Layout(props) {
  return (
    <Container fluid className={`${props.outerClassName} ${styles.main_container}`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>AutoMuteUs</title>
      </Head>
      <Header />
      <main
        id="main-content"
        className={`d-flex flex-column p-3 ${props.innerClassName}`}
      >
        {props.children}
      </main>
      <Footer effect={props.effect} />
    </Container>
  );
}
