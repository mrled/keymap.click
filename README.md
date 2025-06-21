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
ui                   Build the ui
keyboard.ergodox     Build the keyboard.ergodox package
keyboard.planck48    Build the keyboard.planck48 package
examples             Build the examples package
www                  Build the keymap.click website in production mode
www.serve            Run the keymap.click website in development mode with hot reloading
```
