import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import NProgress from "nprogress";

import "bootstrap/dist/css/bootstrap.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;

import "../public/global.scss";
import "../public/nprogress.css";
import { useRouter } from "next/router";
import { useEffect } from "react";
import LanguageSync from "../components/layout/LanguageSync";

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    const router = useRouter();

    useEffect(() => {
        NProgress.configure({ parent: "#__next", trickleSpeed: 100 });
        const handleStart = () => NProgress.start();
        const handleStop = () => {
            NProgress.done();
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]);

    return (
        <>
            <div className="stars"></div>
            <SessionProvider session={session}>
                <LanguageSync />
                <AnimatePresence mode="wait" initial={false}>
                    <Component {...pageProps} key={router.route} />
                </AnimatePresence>
            </SessionProvider>
        </>
    );
};

export default App;
