import React, { useState } from "react";

import { KeymapUiSettings } from "~/components/keymapUiSettings";
import { IntraAppLink } from "~/components/prose";
import { useAppSettings } from "~/hooks/useAppSettings";

const HamburgerButton = ({ visibleMenu, setVisibleMenu }) => {
  const crossSvg = (
    <div className="w-4">
      <svg fill="none" viewBox="0 0 24 24" className="h-6 w-6">
        <path
          d="M6 18L18 6M6 6L18 18"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          stroke="currentColor"
        />
      </svg>
    </div>
  );

  const hamburgerString = (
    <div className="w-4">
      <span className="text-xl">☰</span>
    </div>
  );

  return (
    <>
      <button
        className="inline p-2"
        onClick={() => {
          setVisibleMenu((s) => !s);
        }}
      >
        {visibleMenu ? crossSvg : hamburgerString}
      </button>
    </>
  );
};

const HomeLink = () => {
  return (
    <>
      <h1 className="site-title">
        <IntraAppLink href="/">keymap.click</IntraAppLink>
      </h1>
    </>
  );
};

const MenuBar = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  return (
    <div className="w-full mx-auto fixed px-1">
      <div
        className="w-full max-w-screen-lg mx-auto border-r border-l border-b rounded-b-md bg-white border-orange-600"
        id="menu-bar-container"
      >
        <div>
          <div className="flex flex-row">
            <HamburgerButton
              visibleMenu={visibleMenu}
              setVisibleMenu={setVisibleMenu}
            />
            <HomeLink />
          </div>
        </div>
        <Sidebar visibleMenu={visibleMenu} setVisibleMenu={setVisibleMenu} />
      </div>
    </div>
  );
};

const SecretSidebarControls = ({ enabled }) => {
  if (!enabled) {
    return <></>;
  }
  return (
    <>
      <div className="mt-4">
        <h2 className="mb-2">Secrets</h2>

        <ul className="list-disc pl-8 text-xs">
          <li>
            <IntraAppLink href="/controls">Control panel</IntraAppLink>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <KeymapUiSettings />
      </div>
    </>
  );
};

const Sidebar = ({ visibleMenu, setVisibleMenu }) => {
  const { advancedMode } = useAppSettings();
  const classes = "sidebar" + (visibleMenu ? " sidebar-visible" : "");

  return (
    <div className={classes}>
      <div className="flex">
        <HomeLink />
        <HamburgerButton
          visibleMenu={visibleMenu}
          setVisibleMenu={setVisibleMenu}
        />
      </div>

      <div className="text-xs py-4">
        <p>My ErgoDox keyboard helped my RSI. Here&apos;s how.</p>
      </div>

      <div className="">
        <h2 className="mb-2">Navigation</h2>

        <ul className="list-disc pl-8 text-xs">
          <li>
            <IntraAppLink href="/about">What is this site?</IntraAppLink>
          </li>
          <li>
            <IntraAppLink href="/ergodox">
              What kind of keyboard is this?
            </IntraAppLink>
          </li>
          <li>
            <IntraAppLink href="/story">Personal history</IntraAppLink>
          </li>
          <li>
            <IntraAppLink href="/colophon">Colophon</IntraAppLink>
          </li>
        </ul>
      </div>

      <SecretSidebarControls enabled={advancedMode} />
    </div>
  );
};

export const SiteChrome = ({ children }) => {
  return (
    <div className="site-chrome">
      <main>{children}</main>
      <div className="absolute top-0 mx-auto">
        <MenuBar />
      </div>
    </div>
  );
};
