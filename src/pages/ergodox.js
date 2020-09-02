import React from "react";

import { MenuBar } from "~/components/menuBar";
import {
  ExternalLink,
} from "~/components/prose";
import { IntraAppLink } from "../components/prose";

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
              <ul className="list-disc mt-2 ml-6">
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
              <h2 className="text-2xl pb-4" id="qmk">
                Open source firmware: QMK
              </h2>
              <p className="p-1">
                The various types of ErgoDox all use the fantastic open source
                {" "}<ExternalLink href="https://qmk.fm/">QMK firmware</ExternalLink>.
                QMK is a super power that lets me remap <em>any</em> physical button press
                to <em>any</em> letter or character, or even
                {" "}<ExternalLink href="https://me.micahrl.com/blog/hack-save-qmk-firmware-source-to-keyboard/">
                  any sequence of characters
                </ExternalLink>.
              </p>
              <p className="p-1">
                Most critical for my purposes,
                I can move any character that a normal QWERTY keyboard keeps under a pinkie &mdash;
                {" "}<kbd>escape</kbd>, <kbd>tab</kbd>, <kbd>shift</kbd>, <kbd>ctrl</kbd>,
                {" "}<kbd>return</kbd>, <kbd>backspace</kbd>, and more &mdash;
                to the cluster of keys under the thumbs on my ErgoDox.
                This has been very helpful in <IntraAppLink href="/story">my battle with RSI</IntraAppLink>.
                To see details on this, see the guided tour on <IntraAppLink href="/">the main page</IntraAppLink>.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4" id="qmk-layers">
                Layers in QMK
              </h2>
              <p className="p-1">
                One of QMK's most powerful features is its concept of
                {" "}<ExternalLink href="https://docs.qmk.fm/#/feature_layers">layers</ExternalLink>,
                which let you transform the entire board at the press of a button.
                For instance, when I'm holding the key to activate my
                {" "}<IntraAppLink href="/?keyId=l-f-2-9">function layer</IntraAppLink>,
                QMK transforms the number keys <kbd>1</kbd> through <kbd>0</kbd>{" "}
                to function keys <kbd>F1</kbd> through <kbd>F10</kbd>{" "},
                transforms other keys to multimedia keys or keys to control screen brightness, and more.
                When I let go of the function layer key, the board snaps back to normal instantly.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4" id="my-keymap">
                My QMK keymap
              </h2>
              <p className="p-1">
                I keep the source code for my keymap on GitHub; you can find it
                {" "}<ExternalLink href="https://github.com/mrled/qmk_firmware/blob/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
                  here
                </ExternalLink>.
                (Unfortunately, it's hard to read with GitHub's stylesheets or on a small screen.
                If you're reading this on a wide monitor, you might find it easier to see
                {" "}<ExternalLink href="https://raw.githubusercontent.com/mrled/qmk_firmware/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
                  in the raw
                </ExternalLink>.)
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
