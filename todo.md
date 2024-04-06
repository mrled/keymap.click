# TODOs

* Eradicate all the TODOs I've added to the code
* Add guide back
* Add support for layers
* Support creating a new key-map-ui element pointing to a specific key or guide step - needs testing
* diamargs seem to start drawing only at the halfway point, see the arrow layer for example, the inner half of the diamarg is empty and on each side all four lines are drawn in the outer half. This bug exists in the React version too.
* Place CSS specific to a web component next to the web component
    * Use the shadow DOM for all components
    * Allow custom colors by overriding CSS vars; document this
* Update readme
* Add interface for like INamedWebComponent, a wc that knows its own element name with a .elementName property, and make registerAll simpler.
* Standardize capitalization and hyphenization of KeyMap/Keymap, KeyBoard/Keyboard, key-map/keymap, etc
* Standardize capitalization of filenames
* Use a prefix for all our webcomponents?
    * Web components require a dash in their names, this might help with standard hyphenization for single words like keyboard
    * e.g. `<my-keyboard>` or `<kdc-keyboard>` or something
