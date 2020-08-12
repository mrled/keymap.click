import React from "react";

import log from "loglevel";

import { KeyblayUI } from "../components/keyblayUi";

log.enableAll();

export default function Home() {
  return (
    <>
      <div>
        <KeyblayUI />
      </div>
    </>
  );
}
