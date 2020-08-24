import React from "react";

import { MenuBar } from "~/components/menuBar";

export default function About() {
  return (
    <>
      <MenuBar />

      <div className="w-full h-full text-sm md:text-base p-4 flex max-w-screen-lg mx-auto">
        <div className="w-full md:mr-8 md:px-4">

          <div
            className="border border-gray-300 bg-gray-100 rounded-md p-2 m-2"
          >

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                ErgoDox keyboards
              </h2>
              <p className="p-1">
                ErgoDox keyboards are open source keyboards that are designed with ergonomics in mind
                and are entirely customizable.
                See the homepage of the open source ErgoDox project:
                {" "}<a className="text-blue-600" href="https://www.ergodox.io/">
                  https://www.ergodox.io/
                </a>.
                They come in several different varieties.
              </p>
              <ul className="list-disc mt-2 ml-4">
                <li>
                  <a className="text-blue-600" href="https://ergodox-ez.com/">
                    ErgoDox-EZ
                    </a>{" "}
                    pre-assembled boards. This is what I have.
                  </li>
                <li>
                  <a className="text-blue-600" href="https://input.club/devices/infinity-ergodox/">
                    ErgoDox Infinity
                    </a>{" "}
                    kits.
                  </li>
                <li>
                  <a className="text-blue-600" href="https://www.ergodox.io/#parts">
                    Assembled from raw parts
                    </a>.
                  </li>
              </ul>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                Open source firmware: QMK
              </h2>
              <p className="p-1">
                The various types of ErgoDox all use the fantastic open source
                {" "}<a className="text-blue-600" href="https://qmk.fm/">QMK firmware</a>.
                This is the super power that lets you map any physical button press to any single key,
                or even
                {" "}<a className="" href="https://me.micahrl.com/blog/hack-save-qmk-firmware-source-to-keyboard/">
                  any sequence of keys
                </a>.
                It also supports
                {" "}<a className="" href="https://docs.qmk.fm/#/feature_layers">layers</a>,
                which let you transform the entire key map at the press of a button.
                Critical for my purposes,
                it let me remap keys that a normal QWERTY keyboard keeps under a pinkie --
                escape, tab, shift, ctrl, return, backspace, and more --
                to the cluster of keys under the thumbs on my ErgoDox.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
