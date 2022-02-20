import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { AnimatePresence } from "framer-motion";
import SSRProvider from "react-bootstrap/SSRProvider";
import "reflect-metadata";

import "bootstrap/dist/css/bootstrap.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;

import "../styles/global.scss";

const App = ({
    Component,
    pageProps: { session, ...pageProps },
    router,
}: AppProps) => {
    return (
        <SSRProvider>
            <div className="stars"></div>
            <SessionProvider session={session}>
                <AnimatePresence exitBeforeEnter initial={false}>
                    <Component {...pageProps} key={router.route} />
                </AnimatePresence>
            </SessionProvider>
        </SSRProvider>
    );
};

export default App;
