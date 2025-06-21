# KeymapKit

The presentation layer for your keyboard.

KeymapKit provides a UI for displaying keyboard layouts, including key legends, multiple layers, drawing diagram lines to specific keys, and layout tours.

It looks like this:

![Screenshot](docs/screenshot.png?raw=true "Screenshot")

## Development

Use the makefile

```console
$ make
help                 Show this help
lint                 Run eslint
format               Run prettier
clean                Clean up
ui                   Build @keymapkit/ui
keyboard.ergodox     Build @keymapkit/keyboard.ergodox
keyboard.planck48    Build @keymapkit/keyboard.planck48
examples             Build the @keymapkit/examples
www                  Build the KeymapKit website in production mode
www.serve            Run the KeymapKit website in development mode with hot reloading

```
