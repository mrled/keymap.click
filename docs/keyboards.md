# Keyboards

At the moment, ErgoDox and Planck keyboard models ship with Clickmap,
along with a tiny 12-key test board that doesn't exist in the physical world
that can be used as a fallback.

In the future, it's probably better to implement other keyboards *outside* of Clickmap,
because each one increases Clickmap's bundled size.
It's probably worth moving the ErgoDox and Planck models outside of Clickmap too.

## Defining a new keyboard

* Look at the Planck48 model and web component for a simple example.
* The ErgoDox web component shows a more complex layout with multiple keygrids.
* Set the width and height based on the `--keyboard-grid-unit` CSS custom property
  in the `calculateSize()` instance method.
  The keyboard will contain `<clickmap-key>` elements sized by `--keyboard-grid-unit`,
  so in a simple rectangular keyboard shape like the Planck,
  the width is the number of keys wide times the grid unit,
  and the height is the number of keys tall times the grid unit.
  For more complex shapes like the ErgoDox,
  you can do a specific calculation or just experiment and set something close.
