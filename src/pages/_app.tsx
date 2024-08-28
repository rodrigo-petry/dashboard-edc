import type { AppProps } from "next/app";
import Head from "next/head";

import Root from "@components/Root";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Energia das Coisas</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <Root>
        <Component {...pageProps} />
      </Root>
    </>
  );
}

export default MyApp;
