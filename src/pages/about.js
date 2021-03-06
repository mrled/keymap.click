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
              <h1 className="text-3xl pb-4">What is this?</h1>
              <p className="p-1">
                This site is a visual explanation of my keyboard layout.
              </p>
              <p className="p-1">
                The keyboard, an{" "}
                <IntraAppLink href="/ergodox">ErgoDox-EZ</IntraAppLink>, has
                been a huge part of{" "}
                <IntraAppLink href="/story">
                  my strategy for dealing with RSI
                </IntraAppLink>
                . Maybe it can help you too.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">How did it help?</h2>
              <p className="p-1">
                The ErgoDox keyboard I have is an important aspect of managing
                pain from long periods of typing. It keeps my shoulders square,
                and it has a slight &ldquo;tenting&rdquo;, which keeps my hands
                in a more natural orientation with my thumbs slightly higher
                than my pinkies. Most importantly, it has allowed me to reduce
                the intense strain on my pinkies by moving commonly used keys
                out from under weak pinkies to under much stronger thumbs.
              </p>
              <p className="p-1">
                Take{" "}
                <IntraAppLink href="/?guide=mrlGuide">
                  the guided tour
                </IntraAppLink>{" "}
                for specifics.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">Development</h2>
              <p className="p-1">This is a work in progress.</p>
              <p className="p-1">
                I&apos;m building it{" "}
                <ExternalLink href="https://github.com/mrled/keymap.click">
                  on GitHub
                </ExternalLink>
                . Issues and contributions welcome.
              </p>
              <p className="p-1">
                This project represents a lot of firsts for me. It is my first
                project with a graphical UI in years, my first ever NextJS or
                React project, the first time I&apos;ve used Tailwind CSS, and
                the first web project I&apos;ve built with a UI that I&apos;m
                proud of. It&apos;s the best GUI I&apos;ve ever designed. I made
                my first commit May 24, 2020, and I didn&apos;t know a thing
                about how React or Next worked at that time.
              </p>
              <p className="p-1">And I did it all on my ErgoDox.</p>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
