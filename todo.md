# TODOs

* Eradicate all the TODOs I've added to the code
* Support creating a new key-map-ui element pointing to a specific key or guide step - needs testing
* diamargs seem to start drawing only at the halfway point, see the arrow layer for example, the inner half of the diamarg is empty and on each side all four lines are drawn in the outer half. This bug exists in the React version too.
* Place CSS specific to a web component next to the web component
    * Use the shadow DOM for all components
    * Allow custom colors by overriding CSS vars; document this
* Update readme
* Remove all per-element shadow DOMs from everything except KeyMapUI
* Remove keyboard-element and keymap-id attributes on clicky-ui - the default values should be the first entry in the list of keymaps
* Support guides that work across multiple layers
* Improve the controls UI
    * make it look nicer on desktop
    * make it work on mobile
    * take up less space
    * allow hiding it
    * Don't have its positioning change if other things on the screen change, e.g. right now sometimes if you change guide steps the parent gets wider or narrower and the location of the controls shifts around
