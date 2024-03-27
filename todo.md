# TODOs

* Make vars out of all colors
* Eradicate all the TODOs I've added to the code
* Add guide back
* Can I keep CSS specific to a web component next to the web component?
* Support at least one other keyboard type so that it shakes out all the places where boards/maps/etc are intertwined and shouldn't be
* Add support for layers
* Add support for controlling the routes with query strings or hash, but optionally
* Support multiple key-map-ui elements on the page
* Support creating a new key-map-ui element pointing to a specific key or guide step
* diamargs seem to start drawing only at the halfway point, see the arrow layer for example, the inner half of the diamarg is empty and on each side all four lines are drawn in the outer half. This bug exists in the React version too.
* Place the key-map-ui in the shadow DOM? not sure of implications here. I would like to allow it to be styled without it being stepped on by the site's code, look into this.
* change key info panel to not have a border or background, just text. and make it always as wide as the parent center panel element.
* Make sure it works in Safari
    * Apparently Safari doesn't support Customized Built-In Elements <https://github.com/WebKit/standards-positions/issues/97>
    * The only one I'm doing right now is `<keyboard-key>` which extends `<button>`... I guess I can either turn this into an  Autonomous Custom Element instead, perhaps containing a button? Ugh.
    * OTOH maybe this is nice, Customized Built-in Elements have API warts that make them annoying to use.
* Update readme