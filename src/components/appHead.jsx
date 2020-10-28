import Head from "next/head";
import React from "react";

export const AppHead = () => {
  return (
    <Head>
      <title>keymap.click: A visual keymap explanation</title>
      <link rel="icon" href="/favicon.ico" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      ></meta>

      <meta
        name="og:title"
        property="og:title"
        content="keymap.click: A visual keymap explanation"
      />
      <meta
        name="og:description"
        property="og:description"
        content="How an ErgoDox keyboard helped my RSI."
      />
      <meta property="og:url" content="https://keymap.click" />
      <link rel="icon" type="image/png" href="/command_32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/command_64.png" sizes="64x64" />
      <link
        rel="icon"
        type="image/png"
        href="/command_128.png"
        sizes="128x128"
      />
      <meta name="twitter:site" content="@mrled" />
      <meta name="twitter:creator" content="@mrled" />
      <meta property="og:image" content="/og_image_screenshot.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:image"
        content="https://keymap.click/og_image_screenshot.png"
      />
      <meta
        name="twitter:image:alt"
        content="A screenshot of how the app works"
      />
      <meta
        name="twitter:title"
        content="keymap.click: A visual keymap explanation"
      />
      <meta
        name="twitter:description"
        content="How an ErgoDox keyboard helped my RSI."
      />
      <meta name="twitter:image:width" content="310" />
      <meta name="twitter:image:height" content="285" />
    </Head>
  );
};
