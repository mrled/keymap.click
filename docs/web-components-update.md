# Web Components Update

In 2024, I migrated from Tailwind and React to Web Components and vanilla JS/CSS.
Documenting some design decisions here;
TODO: refactor this later to something more user-facing.

## No third party libraries in shipped code

You can't get away with this for dev code, but for shipped code I'm going to do it if it kills me.

## State

I don't even want third party library for state, althoguh I'm beginning to regret this.

## CSS bundling

I want to use a single system for the web components I'll ship to users
(NPM package, CDN URL, release file downloaded from github, etc)
and the website at keymap.click
and any small test/demo sites.

I'm planning to use esbuild for this, which is nice but does have some limitations.
Some notes about this.

- It can bundle JS and CSS together into a single file by treating CSS as plain text
- For it to support bundling fonts, it can't treat CSS as plain text
- That's ok, maybe I don't ship a font by default and let users override them anyway
- Its command line interface is limited, as it cannot e.g. bundle css and js into two separate output files in one command
- Its JS API is under-documented, bc the above is definitely possible with it but I couldn't figure out how to do it

## Shadow DOM

- Place the key-map-ui children on the shadow DOM
- But use a shared shadow DOM for all of them
- The current design has the drawing code find elements by ID, which doesn't work if they're hidden in shadow DOM
- Considered changing to emitting events on creation of elements, but that sounded indirect and surprising, and I'm not sure it would work with resizing
- TODO: should I use a parent element that has a shadow DOM and puts key-map-ui inside it, and not use a shadow DOM on key-map-ui itself? Right now I have the shadow DOM on key-map-ui itself, which means that its descendents that need to pass it events must do so with "composed: true".
