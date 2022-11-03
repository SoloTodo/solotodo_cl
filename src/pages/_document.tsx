import * as React from "react";
// next
import Document, { Html, Head, Main, NextScript } from "next/document";
// emotion
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
// theme
import { constants } from "src/config";

// ----------------------------------------------------------------------

function createEmotionCache() {
  return createCache({ key: "css" });
}

export default class MyDocument extends Document {
  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        
        gtag('config', '${constants.GA3Id}', {'send_page_view': false});
        gtag('config', '${constants.GA4Id}', {'send_page_view': false});
      `,
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />

          {/* <link rel="manifest" href="/manifest.json" /> */}

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          <meta
            name="title"
            content="Cotiza y ahorra cotizando todos tus productos de tecnología en un sólo lugar - SoloTodo"
          />
          <meta
            name="description"
            content="Ahorra tiempo y dinero cotizando celulares, notebooks, etc. en un sólo lugar y comparando el precio de todas las tiendas."
          />
          <meta name="keywords" content="solotodo" />
          <meta name="author" content="SoloTodo" />

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${constants.GA3Id}`}
          ></script>
          <script
            async
            src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                      var googletag = googletag || {};
                      googletag.cmd = googletag.cmd || [];
                  `,
            }}
          />
          <script dangerouslySetInnerHTML={this.setGoogleTags()} />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// ----------------------------------------------------------------------

MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App) => (props) =>
        (
          <CacheProvider value={cache}>
            <App {...props} />
          </CacheProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);

  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
