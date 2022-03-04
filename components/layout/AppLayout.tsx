import { motion } from "framer-motion";
import Head from "next/head";
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Metadata from "./Metadata";

type Props = {
    children?: ReactNode;
    title?: string;
    theatric?: boolean;
    metaTitle?: string;
    metaDesc?: string;
    metaImg?: string;
};

export default function AppLayout({
    children,
    title,
    theatric,
    metaTitle,
    metaDesc,
    metaImg,
}: Props): React.ReactElement {
    return (
        <>
            <Head>
                <title>
                    {title ?? "AutoMuteUs - Hands Free Among Us Muting"}
                </title>
                <Metadata metaImg={metaImg} metaDesc={metaDesc} metaTitle={metaTitle ?? title} />
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
}
