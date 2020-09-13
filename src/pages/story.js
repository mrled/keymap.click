import React from "react";

import { SiteChrome } from "~/components/siteChrome";
import {
  ExternalLink,
  IntraAppLink,
} from "~/components/prose";

export default function Story() {
  return (
    <SiteChrome>
      <div className="w-full h-full text-sm md:text-base flex max-w-screen-lg mx-auto">
        <div className="w-full ">
          <div className="pt-2 mt-2">

            <div className="m-4 p-4">
              <h1 className="text-2xl pb-4">
                Personal history
              </h1>
              <p className="p-1">
                In 2019, I started to feel pain when typing.
                I had had typing related repetitive stress injury (RSI) pain almost a decade before,
                and became pain-free with the help of a registered occupational therapist (OTR).
                However, this time, the stretches and ice regimen she had given me were not effective,
                and I sought out other treatments.
              </p>
              <p className="p-1">
                RSI can instigate brutal feelings of depression and hopelessness,
                especially if your career depends on your ability to type for many hours as mine does.
                If this is you, I&apos;m so sorry.
                I built this site to show one aspect of my strategy for managing pain from repetitive stress.
              </p>
              <p className="p-1">
                Do note that this is just <em>one aspect</em>.
                I hope to talk more about the other aspects in the future.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                How an ErgoDox helped
              </h2>
              <p className="p-1">
                I would have tried anything to help with the pain.
                My research suggested that trying a split keyboard could help by keeping my shoulders square and,
                along with a desk at the proper height,
                keeping my elbows at right angles.
                I&apos;d found several options and ultimately decided I wanted to try an
                {" "}<IntraAppLink href="/ergodox">ErgoDox keyboard</IntraAppLink>.
              </p>
              <p className="p-1">
                My brother had an
                {" "}<ExternalLink href="https://input.club/devices/infinity-ergodox/">
                  ErgoDox Infinity
                </ExternalLink>{" "}
                that he had bought as a kit and put together himself,
                and attempted to convince me to get one of my own.
                Rather than build a kit myself, though,
                I opted for a preassembled
                {" "}<ExternalLink href="https://ergodox-ez.com/">ErgoDox-EZ</ExternalLink>.
              </p>
              <p className="p-1">
                It turned out that while it was true that my shoulders were more square when I used it,
                I had not anticipated a much more significant benefit.
                I could remap every painful key under my pinkies to keys under my thumbs.
                For instance, I moved
                {" "}<IntraAppLink href="/?keyId=l-t-1-3">
                  the shift key
                </IntraAppLink>{" "}
                to an easy location under my left thumb.
              </p>
              <p className="p-1">
                Before this, pinkies on both hands hurt. A lot.
                They would alternate,
                some days the right hand, some days the left hand, some both, some neither.
                The finger would naturally curl into what felt like a useless claw,
                and stretching my hand flat would be painful.
                Hitting any key with that finger would cause pain, sometimes sharp pain,
                and chording (e.g. holding shift with a pinky while reaching for a letter)
                was impossible.
                The tendon on the outer side of my forearm
                that runs from the pinky to the elbow
                would be swollen and rock hard.
                Grip was difficult.
                Some days I didn&apos;t trust my ability to hold a full pint glass with one hand.
              </p>
              <p className="p-1">
                But when I moved the commonly used keys like shift under my thumb,
                the difference was night and day.
                Once I got used to the placement, I could type longer without hurting.
                I never had grip problems
                and had pain there much less often.
                It didn&apos;t solve RSI for me,
                and I&apos;ve been working to manage it ever since,
                with some success but not total victory.
                But just the key relocation really did mean the difference
                between a week of full productive days and a week of misery,
                coming in late and leaving early and trying to find anything to do besides type.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                About me
              </h2>
              <p className="p-1">
                I&apos;m{" "}
                <ExternalLink href="https://me.micahrl.com">Micah</ExternalLink>.
                Hi 👋
              </p>
              <p className="p-1">
                Please,{" "}
                <ExternalLink href="https://me.micahrl.com/standing-invitation">
                  email me
                </ExternalLink>.
              </p>
            </div>

          </div>

        </div>
      </div>
    </SiteChrome>
  );
}
