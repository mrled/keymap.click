import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <>

      <div className="w-full h-full text-sm md:text-base p-4 flex max-w-screen-lg mx-auto">

        <div className="w-full md:mr-8 md:px-4">

          <div
            className="border border-gray-300 bg-gray-100 rounded-md p-2 m-2"
          >
            <div className="flex flex-row justify-between">

              <h1
                className="text-blue-600 text-xl flex-col p-2 keyblay-font-roboto-mono"
              >
                <Link href="/"><a>keymap.click</a></Link>
              </h1>
              <div className="text-xl flex-col p-2">
                <p></p>
              </div>

            </div>

            <hr className="m-4" />

            <div className="container m-4 p-4">

              <h1 className="text-3xl pb-4">
                Experiments in keyboard layouts
              </h1>
              <p className="p-1">This is a work in progress.</p>
              <p className="p-1">
                I am building this to show off keyboard layouts for my ErgoDox, and
                provide explanations for why I made the layout decisions I made. The
                ErgoDox-EZ has been a huge part of my strategy for dealing with RSI, and
                I want to be able to visually explain to others how it helped me.
              </p>
              <p className="p-1">
                I am building it on GitHub. Issues and contributions welcome.{" "}
                <a
                  className="text-blue-600"
                  href="https://github.com/mrled/keymap.click"
                >
                  https://github.com/mrled/keymap.click
              </a>
              </p>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}
