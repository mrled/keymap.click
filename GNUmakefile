# -*- mode: Makefile -*-

# A portable, self-documenting GNU Makefile for projects
#
# Suitable for projects where you write the Makefile by hand.
#
# Notes:
# - ".PHONY" targets do not generate files
# - Targets without .PHONY are assumed to generate files
# - See the help comment, after '##', for each target
# - For targets that do not have a '## comment', they are not shown in the help output
# - The help target is the first target, so it's also what gets run if you just run 'make' without a target

# Ignore built-in inference rules that determine eg how to build object files from C source code.
# You might not want this if you're writing a Makefile for a C project.
.SUFFIXES:

# Warn if any variables are undefined.
MAKEFLAGS += --warn-undefined-variables

# Using bash fixes build problems in Vercel.
SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c

# Show a nice table of Make targets.
.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

node_modules/.installed: package.json package-lock.json */package.json */package-lock.json
	npm install
	touch node_modules/.installed

.PHONY: lint
lint: node_modules/.installed ## Run eslint
	cd ./ui && npx eslint .
	cd ./www && npx eslint .

.PHONY: clean
clean: ## Clean up
	rm -rf ui/dist
	rm -rf keyboard.ergodox/dist
	rm -rf examples/dist
	rm -rf www/_site
	rm -rf www/static/keymap.click/*


## @keymap.click/ui
UI_SOURCES = $(shell find ui/src -type f)
ui/dist/keymap.click.js: node_modules/.installed $(UI_SOURCES)
	npm run build -w ui
.PHONY: ui
ui: ui/dist/keymap.click.js ## Build the ui


## @keymap.click/keyboard.ergodox
KEYBOARD_ERGODOX_SOURCES = $(shell find keyboard.ergodox/ -type f -maxdepth 1)
keyboard.ergodox/dist/keyboard.ergodox.js: node_modules/.installed ui/dist/keymap.click.js $(KEYBOARD_ERGODOX_SOURCES)
	npm run build -w keyboard.ergodox
.PHONY: keyboard.ergodox
keyboard.ergodox: keyboard.ergodox/dist/keyboard.ergodox.js ## Build the keyboard.ergodox package


## @keymap.click/keyboard.planck48
KEYBOARD_PLANCK48_SOURCES = $(shell find keyboard.planck48/ -type f -maxdepth 1)
keyboard.planck48/dist/keyboard.planck48.js: node_modules/.installed ui/dist/keymap.click.js $(KEYBOARD_PLANCK48_SOURCES)
	npm run build -w keyboard.planck48
.PHONY: keyboard.planck48
keyboard.planck48: keyboard.planck48/dist/keyboard.planck48.js ## Build the keyboard.planck48 package


## @keymap.click/examples
EXAMPLES_SOURCES = $(shell find examples/ -type f -maxdepth 1)
examples/dist/examples.js: node_modules/.installed ui/dist/keymap.click.js keyboard.ergodox/dist/keyboard.ergodox.js $(EXAMPLES_SOURCES)
	npm run build -w examples
.PHONY: examples
examples: examples/dist/examples.js ## Build the examples package


## @keymap.click/www
WWW_SOURCES = $(shell find www -type f -maxdepth 1)
www/static/keymap.click/keymap.click.js: ui/dist/keymap.click.js
	mkdir -p www/static/keymap.click
	cp ui/dist/keymap.click.js www/static/keymap.click/keymap.click.js
www/static/keymap.click/keyboard.ergodox.js: keyboard.ergodox/dist/keyboard.ergodox.js
	mkdir -p www/static/keymap.click
	cp keyboard.ergodox/dist/keyboard.ergodox.js www/static/keymap.click/keyboard.ergodox.js
www/static/keymap.click/keyboard.planck48.js: keyboard.planck48/dist/keyboard.planck48.js
	mkdir -p www/static/keymap.click
	cp keyboard.planck48/dist/keyboard.planck48.js www/static/keymap.click/keyboard.planck48.js
www/static/keymap.click/examples.js: examples/dist/examples.js
	mkdir -p www/static/keymap.click
	cp examples/dist/examples.js www/static/keymap.click/examples.js
WWW_BUILT_DEPS = www/static/keymap.click/keymap.click.js www/static/keymap.click/keyboard.ergodox.js www/static/keymap.click/keyboard.planck48.js www/static/keymap.click/examples.js
www/_site/.build: www/package.json $(WWW_BUILT_DEPS) $(WWW_SOURCES)
	npm run build:prod -w www
	touch www/_site/.build
.PHONY: www
www: www/_site/.build ## Build the keymap.click website in production mode
.PHONY: www.serve
www.serve: ## Run the keymap.click website in development mode, automatically watching for changes and rebuilding
	@\
		npm run keymap.click.watch -w ui & \
		npm run keymap.click.watch -w keyboard.ergodox & \
		npm run keymap.click.watch -w keyboard.planck48 & \
		npm run keymap.click.watch -w examples & \
		npm run serve:dev -w www & \
		wait

