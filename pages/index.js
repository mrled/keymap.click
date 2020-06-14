import { useState } from "react";
import Head from "next/head";
import log from "loglevel";
import { Keyboard } from "../components/keyboard";
log.enableAll();
export default function Home() {
  return (
    <>
      <Head>
        <title>ErgoDox-EZ Keyboard Layout</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <div>
        <Keyboard />
      </div>
    </>
  );
}
