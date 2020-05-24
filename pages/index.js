import { useState } from "react";
import Head from "next/head";
import { Keyboard } from "../components/keyboard";
export default function Home() {
  return (
    <div className="text-sm md:text-base p-4">
      <div style={{ maxWidth: 750 }} className="my-24 container mx-auto">
        <Head>
          <title>ErgoDox-EZ Keyboard Layout</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Keyboard />
      </div>
    </div>
  )
}