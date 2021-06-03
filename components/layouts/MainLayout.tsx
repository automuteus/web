import React, { ReactNode } from "react";
import Head from "next/head";
import { motion } from "framer-motion";

import Header from "./Header";
import Footer from "./Footer";
import Metadata from "./Metadata";

type Props = {
  children?: ReactNode;
  title?: string;
  theatric?: boolean;
  metaImg?: string;
};

const MainLayout = ({ children, title, theatric, metaImg }: Props) => (
  <>
    <Head>
      <title> {title ?? "AutoMuteUs - Hands Free Among Us Muting"}</title>
      <Metadata metaImg={metaImg} />
    </Head>
    <div id="layout-container" className={theatric ? "theatric" : ""}>
      <Header />
      <motion.main
        className="container-fluid"
        id="content-container"
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  </>
);

export default MainLayout;
