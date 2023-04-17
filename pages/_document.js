import React from 'react';
import { ServerStyleSheets } from '@mui/styles';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <link
          href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        ></link>
        {/* <link
          rel="stylesheet"
          href="https://unicons.iconscout.com/release/v4.0.0/css/line.css"
        /> */}

        <link rel="icon" href="/favicon.ico" />
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originRenderPage = ctx.renderPage;

  ctx.renderPage = () => {
    return originRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });
  };
  const initProps = await Document.getInitialProps(ctx);
  return {
    ...initProps,
    styles: [
      ...React.Children.toArray(initProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
