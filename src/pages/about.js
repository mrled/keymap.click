import React from "react";

import { MenuBar } from "~/components/menuBar";
import {
  IntraAppLink,
} from "~/components/prose";

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
              <h1 className="text-3xl pb-4">
                Experiments in keyboard layouts
              </h1>
              <p className="p-1">
                I am building this to show off keyboard layouts for my ErgoDox, and
                provide explanations for why I made the layout decisions I made. The
                ErgoDox-EZ has been a huge part of
                {" "}<IntraAppLink href="/story">my strategy for dealing with RSI</IntraAppLink>,
                and I want to be able to visually explain to others how it helped me.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                Summary
              </h2>
              <p className="p-1">
                The ErgoDox keyboard I have is an important aspect of managing pain from long periods of typing.
                It keeps my shoulders square,
                it has a slight "tenting" which keeps my hands in a more natural orientation
                with my thumbs slightly higher than my pinkies,
                and most importantly it has allowed me to reduce the intense strain on my pinkies
                by moving some of the most important keys on the keyboard out from under weak pinkies
                to locations I can hit with my much stronger thumbs.
              </p>
            </div>

            <div className="m-4 p-4">
              <h2 className="text-2xl pb-4">
                Development
              </h2>
              <p className="p-1">This is a work in progress.</p>
              <p className="p-1">
                I'm building it{" "}
                <a className="text-blue-600" href="https://github.com/mrled/keymap.click">on GitHub</a>.
                Issues and contributions welcome.
              </p>
              <p className="p-1">
                This project represents a lot of firsts for me.
                It is my first project with a graphical UI in years,
                my first ever NextJS or React project,
                the first time I've used Tailwind CSS,
                and the first web project I've built with a UI that I'm proud of.
                It's the best GUI I've ever designed.
                I made my first commit May 24, 2020,
                and I didn't know a thing about how React or Next worked at that time.
              </p>
              <p className="p-1">And I did it all on my ErgoDox.</p>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
