import { useState } from "react";
import Head from "next/head";
import log from 'loglevel';
import { Keyboard } from "../components/keyboard";
log.enableAll();
export default function Home() {
  return (
    <>
      <Head>
        <title>ErgoDox-EZ Keyboard Layout</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Keyboard />
      </div>
    </>
  );
}
