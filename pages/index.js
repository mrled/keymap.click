import React from "react";

import { KeyblayUI } from "~/components/keyblayUi";
import { MenuBar } from "~/components/menuBar";

export default function Home() {
  return (
    <>
      <MenuBar showSettings={true} />
      <KeyblayUI />
    </>
  );
}
