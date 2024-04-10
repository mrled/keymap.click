# keymap.click

A visual keymap explanation --
how an ErgoDox keyboard helped my RSI.

See it in action:
<https://keymap.click>

![Screenshot](docs/screenshot.png?raw=true "Screenshot")

## What is this?

My goal is to be able to show off keyboard layouts for my ErgoDox,
and provide explanations for why I made the layout decisions I made.
The ErgoDox-EZ has been a huge part of my strategy for dealing with RSI,
and I want to be able to visually explain to others how it helped me.

It's also a way for me to learn modern web development.
I've never built a web app like this before,
and I built it in about 5 months of nights and weekends.

## WIP: moving to web components

I'm migrating away from Next.JS and React to vanilla JS and web components.
I will build a reusable package that can be embedded in any webpage
to show a keymap and optionally a tour of the layout.

I'll migrate the <https://keymap.click> site away from Next/React as well
to something simpler --
currently exploring something small made with Vite.

The website with the content about RSI and ErgoDox boards
will be disentangled from the components that show keyboards and provide tours.

I also want to support other keyboard models --
I'm typing this rn on a Voyager :) --
and proper layer support.

## How it's built

- Node and NPM

Development mode:

```bash
npm install

# Show the main https://keymap.click website
npm run website:dev

# Build https://keymap.click for production to dist/keymap.click
npm run website:build

# Build the webcomponent alone to dist/webcomponent that uses Vite and has excellent hot reloading support
npm run component:build

# Build and run the simple esbuild-only test site that uses esbuild for limited auto reloading (with some caveats)
npm run testsite:simple

# Build and run a very basic site that uses the web component the same way any user can use it with no auto reloading at all
npm run testsite:separate
```

I'm using `prettier` so I don't have to have a dumb code formatting opinion.

## Thanks

- Josh:
  I would still be trying to build this from scratch without a framework
  if it weren't for your kind help.
  THANK YOU so much.
- The community that built the original ErgoDox
  (see <https://www.ergodox.io/>):
  I'm not sure I would have been able to work for some weeks of 2019
  without this keyboard.
  It's made a big difference.
  Thanks for making it.
- ZSA Technology Labs, makers of the
  [ErgoDox-EZ](https://ergodox-ez.com/):
  I doubt I would have tried to build one on my own.
  Thank you for making it easier to get.
