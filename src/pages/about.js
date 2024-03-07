import React from "react";
import Link from "next/link";

import { SiteChrome } from "~/components/siteChrome";

export default function About() {
  return (
    <SiteChrome>
      <h1>What is this?</h1>
      <p>This site is a visual explanation of my keyboard layout.</p>
      <p>
        The keyboard, an <Link href="/ergodox">ErgoDox-EZ</Link>, has been a
        huge part of <Link href="/story">my strategy for dealing with RSI</Link>
        . Maybe it can help you too.
      </p>

      <h2>How did it help?</h2>
      <p>
        The ErgoDox keyboard I have is an important aspect of managing pain from
        long periods of typing. It keeps my shoulders square, and it has a
        slight &ldquo;tenting&rdquo;, which keeps my hands in a more natural
        orientation with my thumbs slightly higher than my pinkies. Most
        importantly, it has allowed me to reduce the intense strain on my
        pinkies by moving commonly used keys out from under weak pinkies to
        under much stronger thumbs.
      </p>
      <p>
        Take <Link href="/?guide=mrlGuide">the guided tour</Link> for specifics.
      </p>

      <h2>Development</h2>
      <p>This is a work in progress.</p>
      <p>
        I&apos;m building it{" "}
        <a href="https://github.com/mrled/keymap.click">on GitHub</a>. Issues
        and contributions welcome.
      </p>
      <p>
        This project represents a lot of firsts for me. It is my first project
        with a graphical UI in years, my first ever NextJS or React project, the
        first time I&apos;ve used Tailwind CSS, and the first web project
        I&apos;ve built with a UI that I&apos;m proud of. It&apos;s the best GUI
        I&apos;ve ever designed. I made my first commit May 24, 2020, and I
        didn&apos;t know a thing about how React or Next worked at that time.
      </p>
      <p>And I did it all on my ErgoDox.</p>
    </SiteChrome>
  );
}
