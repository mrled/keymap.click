import React from "react";

import { KeymapUI } from "~/components/keymapUi";
import { MenuBar } from "~/components/menuBar";

export default function Home() {
  return (
    <>
      <MenuBar showSettings={true} />
      <KeymapUI />
    </>
  );
}
