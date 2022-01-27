import React from "react";

import { SiteChrome } from "~/components/siteChrome";
import { ExternalLink, IntraAppLink } from "~/components/prose";

export default function About() {
  return (
    <SiteChrome>
      <div className="w-full h-full text-sm md:text-base flex max-w-screen-lg mx-auto">
        <div className="w-full ">
          <div className="pt-2 mt-2">
            <div className="m-4 p-4">
              <h1 className="text-3xl pb-4">Colophon</h1>
              <p className="p-1">Many thanks to those listed here.</p>
              <ul className="pl-8 py-4 list-disc">
                <li>
                  Josh: I would still be trying to build this from scratch
                  without a framework if it weren&apos;t for your kind help.
                  THANK YOU so much.
                </li>
                <li>
                  The community that built the{" "}
                  <ExternalLink href="https://www.ergodox.io">
                    original ErgoDox
                  </ExternalLink>
                  . I&apos;m not sure I would have been able to work for some
                  weeks of 2019 without this keyboard. It&apos;s made a big
                  difference. Thanks for making it.
                </li>
                <li>
                  ZSA Technology Labs, makers of the{" "}
                  <ExternalLink href="https://ergodox-ez.com">
                    ErgoDox EZ
                  </ExternalLink>
                  . I doubt I would have tried to build one on my own. Thank you
                  for making it easier to get.
                </li>
                <li>
                  Wikimedia Commons for the{" "}
                  <ExternalLink href="https://commons.wikimedia.org/wiki/File:Looped_square_on_white_background.svg">
                    Looped square on white background SVG
                  </ExternalLink>
                  , released into the public domain
                </li>
                <li>
                  Terence Eden for making me aware of{" "}
                  <ExternalLink href="https://shkspr.mobi/blog/2020/05/better-keyboard-buttons-in-html/">
                    The &lt;kbd&gt; element
                  </ExternalLink>
                </li>
                <li>
                  Xah Lee&apos;s useful{" "}
                  <ExternalLink href="http://xahlee.info/comp/unicode_computing_symbols.html">
                    list of unicode computing symbols
                  </ExternalLink>
                </li>
                <li>
                  @Robin on the Tailwind Discord server, who helped me solve{" "}
                  <ExternalLink href="docs/issues/bad-first-render-in-production/index.md">
                    a layout bug on initial load
                  </ExternalLink>
                </li>
                <li>
                  Google for{" "}
                  <ExternalLink href="https://fonts.google.com/specimen/Roboto+Mono">
                    Roboto Mono
                  </ExternalLink>
                  , under the{" "}
                  <ExternalLink href="http://www.apache.org/licenses/LICENSE-2.0">
                    Apache License, Version 2.0
                  </ExternalLink>
                </li>
                <li>
                  Google for{" "}
                  <ExternalLink href="https://developers.google.com/fonts/docs/material_icons">
                    Material Icons
                  </ExternalLink>
                  , under the{" "}
                  <ExternalLink href="http://www.apache.org/licenses/LICENSE-2.0">
                    Apache License, Version 2.0
                  </ExternalLink>
                </li>
                <li>
                  The GNU Project for{" "}
                  <ExternalLink href="https://www.gnu.org/software/freefont/index.html">
                    FreeFont Mono
                  </ExternalLink>
                  , under the{" "}
                  <ExternalLink href="http://www.gnu.org/licenses/gpl.html">
                    version 3 of the GNU General Public License
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink href="https://thenounproject.com/icon/escape-217258/">
                    Escape
                  </ExternalLink>{" "}
                  copyright Christopher T. Howlett, under{" "}
                  <ExternalLink href="https://creativecommons.org/licenses/by/3.0/legalcode">
                    Creative Commons Attribution Version 3.0 Unported
                  </ExternalLink>
                  . The original work has been modified.
                </li>
                <li>
                  <ExternalLink href="https://thenounproject.com/icon/up-key-2712617/">
                    up key
                  </ExternalLink>{" "}
                  copyright Dika Darma, under{" "}
                  <ExternalLink href="https://creativecommons.org/licenses/by/3.0/legalcode">
                    Creative Commons Attribution Version 3.0 Unported
                  </ExternalLink>
                  . The original work has been modified.
                </li>
                <li>
                  OpenClipart on FreeSVG.com for the{" "}
                  <ExternalLink href="https://freesvg.org/menu-key-icon-vector-illustration">
                    menu key icon
                  </ExternalLink>
                  , released into the public domain
                </li>
                <li>
                  <ExternalLink href="https://icomoon.io/#icons-icomoon">
                    IcoMoon Free Version
                  </ExternalLink>{" "}
                  copyright Keyamoon.com, under{" "}
                  <ExternalLink href="https://creativecommons.org/licenses/by/4.0/legalcode">
                    Creative Commons Attribution Version 4.0 International
                  </ExternalLink>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
