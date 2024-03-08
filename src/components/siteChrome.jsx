import React, { useState } from "react";
import Link from "next/link";

import { KeymapUiSettings } from "~/components/keymapUiSettings";
import { useAppSettings } from "~/hooks/useAppSettings";

const HamburgerButton = ({ visibleMenu, setVisibleMenu }) => {
  const crossSvg = (
    <svg fill="none" viewBox="0 0 24 24">
      <path
        d="M6 18L18 6M6 6L18 18"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        stroke="currentColor"
      />
    </svg>
  );

  const hamburgerString = <span>☰</span>;

  return (
    <>
      <button
        className="sitechrome-button"
        onClick={() => {
          setVisibleMenu((s) => !s);
        }}
      >
        <div className="button-legend-container">
          {visibleMenu ? crossSvg : hamburgerString}
        </div>
      </button>
    </>
  );
};

const HomeLink = () => {
  return (
    <>
      <h1 className="site-title">
        <Link href="/">keymap.click</Link>
      </h1>
    </>
  );
};

const MenuBar = () => {
  const [visibleMenu, setVisibleMenu] = useState(false);

  return (
    <div className="menu-bar">
      <div className="menu-bar-items">
        <HamburgerButton
          visibleMenu={visibleMenu}
          setVisibleMenu={setVisibleMenu}
        />
        <HomeLink />
      </div>
      <Sidebar visibleMenu={visibleMenu} setVisibleMenu={setVisibleMenu} />
    </div>
  );
};

const SecretSidebarControls = ({ enabled }) => {
  if (!enabled) {
    return <></>;
  }
  return (
    <>
      <h2>Secrets</h2>
      <ul>
        <li>
          <Link href="/controls">Control panel</Link>
        </li>
      </ul>
      <KeymapUiSettings />
    </>
  );
};

const Sidebar = ({ visibleMenu, setVisibleMenu }) => {
  const { advancedMode } = useAppSettings();
  const classes = "sidebar" + (visibleMenu ? " sidebar-visible" : "");

  return (
    <div className={classes}>
      <div className="sidebar-menu">
        <HomeLink />
        <HamburgerButton
          visibleMenu={visibleMenu}
          setVisibleMenu={setVisibleMenu}
        />
      </div>

      <p>My ErgoDox keyboard helped my RSI. Here&apos;s how.</p>

      <div>
        <h2>Navigation</h2>

        <ul>
          <li>
            <Link href="/about">What is this site?</Link>
          </li>
          <li>
            <Link href="/ergodox">What kind of keyboard is this?</Link>
          </li>
          <li>
            <Link href="/story">Personal history</Link>
          </li>
          <li>
            <Link href="/colophon">Colophon</Link>
          </li>
        </ul>
      </div>

      <SecretSidebarControls enabled={advancedMode} />
    </div>
  );
};

export const SiteChrome = ({ children }) => {
  return (
    <>
      <main>{children}</main>
      <MenuBar />
    </>
  );
};
