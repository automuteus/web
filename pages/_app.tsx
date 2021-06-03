import { Provider } from "next-auth/client";
import { AnimatePresence } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";
import "reflect-metadata";

import "bootstrap/dist/css/bootstrap.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
config.autoAddCss = false;

import "../styles/global.scss";

import type { AppProps } from "next/app";

function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="stars"></div>
      <Provider session={pageProps.session}>
        <AnimatePresence exitBeforeEnter initial={false}>
          <Component {...pageProps} key={router.route} />
        </AnimatePresence>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
