import React from "react";

import { SiteChrome } from "~/components/siteChrome";
import { ExternalLink } from "~/components/prose";
import { IntraAppLink } from "../components/prose";

export default function About() {
  return (
    <SiteChrome>
      <h1>ErgoDox keyboards</h1>
      <p>
        ErgoDox keyboards are open source keyboards that are designed with
        ergonomics in mind and are entirely customizable. See the homepage of
        the open source ErgoDox project:{" "}
        <ExternalLink href="https://www.ergodox.io/">
          https://www.ergodox.io/
        </ExternalLink>
        . They come in several different varieties.
      </p>
      <ul>
        <li>
          <ExternalLink href="https://ergodox-ez.com/">ErgoDox-EZ</ExternalLink>{" "}
          pre-assembled boards. This is what I have.
        </li>
        <li>
          <ExternalLink href="https://input.club/devices/infinity-ergodox/">
            ErgoDox Infinity
          </ExternalLink>{" "}
          kits which you solder together yourself.
        </li>
        <li>
          <ExternalLink href="https://www.ergodox.io/#parts">
            Assembled from raw parts
          </ExternalLink>
          .
        </li>
      </ul>

      <h2 id="qmk">Open source firmware: QMK</h2>
      <p>
        The various types of ErgoDox all use the fantastic open source{" "}
        <ExternalLink href="https://qmk.fm/">QMK firmware</ExternalLink>. QMK is
        a superpower that lets me remap <em>any</em> physical button press to{" "}
        <em>any</em> letter, character, or even{" "}
        <ExternalLink href="https://me.micahrl.com/blog/hack-save-qmk-firmware-source-to-keyboard/">
          sequence of characters
        </ExternalLink>
        .
      </p>
      <p>
        Most critical for my purposes, I can move a character that a normal
        QWERTY keyboard keeps under a pinkie &mdash; <kbd>escape</kbd>,{" "}
        <kbd>tab</kbd>, <kbd>shift</kbd>, <kbd>ctrl</kbd>, <kbd>return</kbd>,{" "}
        <kbd>backspace</kbd>, and more &mdash; to the cluster of keys under the
        thumbs on my ErgoDox. This has been very helpful in{" "}
        <IntraAppLink href="/story">my battle with RSI</IntraAppLink>. To see
        details on this, take{" "}
        <IntraAppLink href="/?guide=mrlGuide">the guided tour</IntraAppLink>.
      </p>

      <h2 id="qmk-layers">Layers in QMK</h2>
      <p>
        One of QMK&apos;s most powerful features is its concept of{" "}
        <ExternalLink href="https://docs.qmk.fm/#/feature_layers">
          layers
        </ExternalLink>
        , which let you transform the entire board at the press of a button.
      </p>
      <p>
        Most people are probably familiar with a &ldquo;function&rdquo; key,
        like many laptops have &mdash; layers work like that. I have a similar{" "}
        <IntraAppLink href="/?keyId=l-f-2-9">function layer</IntraAppLink> on my
        board. When I hold that key, QMK transforms the number keys <kbd>1</kbd>{" "}
        through <kbd>0</kbd> to function keys <kbd>F1</kbd> through{" "}
        <kbd>F10</kbd> , transforms other keys to controls for multimedia
        playback or screen brightness, and more. When I let go of the function
        layer key, the board snaps back to normal instantly.
      </p>
      <p>
        A more fun one is my{" "}
        <IntraAppLink href="/?keyId=l-f-8-9">arrow layer</IntraAppLink>. When I
        hold that key, QMK transforms <kbd>e</kbd>, <kbd>s</kbd>, <kbd>d</kbd>,{" "}
        <kbd>f</kbd>, and <kbd>i</kbd>, <kbd>j</kbd>, <kbd>k</kbd>, <kbd>l</kbd>{" "}
        into arrow keys, taking inspiration from{" "}
        <ExternalLink href="https://tonsky.me/blog/cursor-keys/">
          this blog post
        </ExternalLink>
        .
      </p>

      <h2 id="my-keymap">My QMK keymap</h2>
      <p>
        I keep the source code for my keymap on GitHub; you can find it{" "}
        <ExternalLink href="https://github.com/mrled/qmk_firmware/blob/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
          here
        </ExternalLink>
        . (Unfortunately, it&apos;s hard to read with GitHub&apos;s stylesheets
        or on a small screen. If you&apos;re reading this on a wide monitor, you
        might find it easier to see it{" "}
        <ExternalLink href="https://raw.githubusercontent.com/mrled/qmk_firmware/master/keyboards/ergodox_ez/keymaps/mrled/keymap.c">
          in the raw
        </ExternalLink>
        .)
      </p>
    </SiteChrome>
  );
}
