import { useState } from "react";
import Head from "next/head";
import log from "loglevel";
import { Keyboard } from "../components/keyboard";
log.enableAll();
export default function Home() {
  return (
    <>
      <Head>
        <title>keyblay: experiments in keyboard layouts</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>

        <meta
          name="og:title"
          property="og:title"
          content="keyblay: experiments in keyboard layouts"
        />
        <meta
          name="og:description"
          property="og:description"
          content="A visual explanation of how an ErgoDox keyboard helped my RSI."
        />
        <meta property="og:url" content="https://keyblay.now.sh" />
        <link
          rel="icon"
          type="image/png"
          href="/command_16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/command_32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/command_128x128.png"
          sizes="128x128"
        />
        <meta property="og:image" content="/og_image_screenshot.png" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <div>
        <Keyboard />
      </div>
    </>
  );
}
