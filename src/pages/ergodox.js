import React from "react";

import { SiteChrome } from "~/components/siteChrome";
import { ExternalLink } from "~/components/prose";
import { IntraAppLink } from "../components/prose";

export default function About() {
  return (
    <SiteChrome>
      <div className="w-full h-full text-sm md:text-base flex max-w-screen-lg mx-auto">
        <div className="w-full ">
          <div className="pt-2 mt-2">
            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">ErgoDox keyboards</h2>
              <p className="p-1">
                ErgoDox keyboards are open source keyboards that are designed
                with ergonomics in mind and are entirely customizable. See the
                homepage of the open source ErgoDox project:{" "}
                <a className="text-blue-600" href="https://www.ergodox.io/">
                  https://www.ergodox.io/
                </a>
                . They come in several different varieties.
              </p>
              <ul className="list-disc mt-2 ml-6">
                <li>
                  <a className="text-blue-600" href="https://ergodox-ez.com/">
                    ErgoDox-EZ
                  </a>{" "}
                  pre-assembled boards. This is what I have.
                </li>
                <li>
                  <a
                    className="text-blue-600"
                    href="https://input.club/devices/infinity-ergodox/"
                  >
                    ErgoDox Infinity
                  </a>{" "}
                  kits which you solder together yourself.
                </li>
                <li>
                  <a
                    className="text-blue-600"
                    href="https://www.ergodox.io/#parts"
                  >
                    Assembled from raw parts
                  </a>
                  .
                </li>
              </ul>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4" id="qmk">
                Open source firmware: QMK
              </h2>
              <p className="p-1">
                The various types of ErgoDox all use the fantastic open source{" "}
                <ExternalLink href="https://qmk.fm/">QMK firmware</ExternalLink>
                . QMK is a superpower that lets me remap <em>any</em> physical
                button press to <em>any</em> letter, character, or even{" "}
                <ExternalLink href="https://me.micahrl.com/blog/hack-save-qmk-firmware-source-to-keyboard/">
                  sequence of characters
                </ExternalLink>
                .
              </p>
              <p className="p-1">
                Most critical for my purposes, I can move a character that a
                normal QWERTY keyboard keeps under a pinkie &mdash;{" "}
                <kbd>escape</kbd>, <kbd>tab</kbd>, <kbd>shift</kbd>,{" "}
                <kbd>ctrl</kbd>, <kbd>return</kbd>, <kbd>backspace</kbd>, and
                more &mdash; to the cluster of keys under the thumbs on my
                ErgoDox. This has been very helpful in{" "}
                <IntraAppLink href="/story">my battle with RSI</IntraAppLink>.
                To see details on this, take{" "}
                <IntraAppLink href="/?guide=mrlGuide">
                  the guided tour
                </IntraAppLink>
                .
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4" id="qmk-layers">
                Layers in QMK
              </h2>
              <p className="p-1">
                One of QMK&apos;s most powerful features is its concept of{" "}
                <ExternalLink href="https://docs.qmk.fm/#/feature_layers">
                  layers
                </ExternalLink>
                , which let you transform the entire board at the press of a
                button.
              </p>
              <p className="p-1">
                Most people are probably familiar with a &ldquo;function&rdquo;
                key, like many laptops have &mdash; layers work like that. I
                have a similar{" "}
                <IntraAppLink href="/?keyId=l-f-2-9">
                  function layer
                </IntraAppLink>{" "}
                on my board. When I hold that key, QMK transforms the number
                keys <kbd>1</kbd> through <kbd>0</kbd> to function keys{" "}
                <kbd>F1</kbd> through <kbd>F10</kbd> , transforms other keys to
                controls for multimedia playback or screen brightness, and more.
                When I let go of the function layer key, the board snaps back to
                normal instantly.
              </p>
              <p className="p-1">
                A more fun one is my{" "}
                <IntraAppLink href="/?keyId=l-f-8-9">arrow layer</IntraAppLink>.
                When I hold that key, QMK transforms <kbd>e</kbd>, <kbd>s</kbd>,{" "}
                <kbd>d</kbd>, <kbd>f</kbd>, and <kbd>i</kbd>, <kbd>j</kbd>,{" "}
                <kbd>k</kbd>, <kbd>l</kbd> into arrow keys, taking inspiration
                from{" "}
                <ExternalLink href="https://tonsky.me/blog/cursor-keys/">
                  this blog post
                </ExternalLink>
                .
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4" id="my-keymap">
                My QMK keymap
              </h2>
              <p className="p-1">
                I keep the source code for my keymap on GitHub; you can find it{" "}
                <ExternalLink href="https://github.com/mrled/qmk_firmware/blob/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
                  here
                </ExternalLink>
                . (Unfortunately, it&apos;s hard to read with GitHub&apos;s
                stylesheets or on a small screen. If you&apos;re reading this on
                a wide monitor, you might find it easier to see it{" "}
                <ExternalLink href="https://raw.githubusercontent.com/mrled/qmk_firmware/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
                  in the raw
                </ExternalLink>
                .)
              </p>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
