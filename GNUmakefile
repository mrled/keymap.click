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

.PHONY: lint
lint: ## Run eslint
	cd ./ui && npx eslint .
	cd ./www && npx eslint .

.PHONY: clean
clean: ## Clean up
	rm -rf ui/dist
	rm -rf keyboard.ergodox/dist
	rm -rf layout.mrlergo/dist
	rm -rf www/_site
	rm -rf www/staticdist

#region keymap.click.ui

UI_SOURCES = $(shell find ui/src -type f)

ui/node_modules: ui/package.json ui/package-lock.json
	cd ./ui && npm install
	touch ui/node_modules

ui/dist/keymap.click.js: ui/node_modules $(UI_SOURCES)
	cd ./ui && npm run build

.PHONY: ui
ui: ui/node_modules ui/dist/keymap.click.js ## Build the ui

#endregion

#region keyboard.ergodox

KEYBOARD_ERGODOX_SOURCES = $(shell find keyboard.ergodox/ -type f -not \( -path "www/dist" -o -path "www/node_modules" \))

keyboard.ergodox/node_modules: keyboard.ergodox/package.json
	cd ./keyboard.ergodox && npm install
	touch keyboard.ergodox/node_modules

keyboard.ergodox/dist/keyboard.ergodox.js: keyboard.ergodox/node_modules ui/dist/keymap.click.js $(KEYBOARD_ERGODOX_SOURCES)
	cd ./keyboard.ergodox && npm run build

.PHONY: keyboard.ergodox
keyboard.ergodox: keyboard.ergodox/dist/keyboard.ergodox.js ## Build the keyboard.ergodox package

#endregion

#region layout.mrlergo

LAYOUT_MRLERGO_SOURCES = $(shell find layout.mrlergo/ -type f -not \( -path "www/dist" -o -path "www/node_modules" \))

layout.mrlergo/node_modules: layout.mrlergo/package.json
	cd ./layout.mrlergo && npm install
	touch layout.mrlergo/node_modules

layout.mrlergo/dist/layout.mrlergo.js: layout.mrlergo/node_modules ui/dist/keymap.click.js keyboard.ergodox/dist/keyboard.ergodox.js $(LAYOUT_MRLERGO_SOURCES)
	cd ./layout.mrlergo && npm run build

.PHONY: layout.mrlergo
layout.mrlergo: layout.mrlergo/dist/layout.mrlergo.js ## Build the layout.mrlergo package

#endregion

#region keymap.click.www

WWW_SOURCES = $(shell find www -type f -not \( -path "www/dist" -o -path "www/node_modules" \))

www/node_modules: www/package.json
	cd ./www && npm install
	touch www/node_modules

www/staticdist:
	mkdir -p www/staticdist

www/staticdist/keymap.click.js: ui/dist/keymap.click.js www/staticdist
	cp ui/dist/keymap.click.js www/staticdist/keymap.click.js

www/staticdist/keyboard.ergodox.js: keyboard.ergodox/dist/keyboard.ergodox.js www/staticdist
	cp keyboard.ergodox/dist/keyboard.ergodox.js www/staticdist/keyboard.ergodox.js

www/staticdist/layout.mrlergo.js: layout.mrlergo/dist/layout.mrlergo.js www/staticdist
	cp layout.mrlergo/dist/layout.mrlergo.js www/staticdist/layout.mrlergo.js

www/dist: www/package.json www/node_modules www/staticdist/keymap.click.js www/staticdist/keyboard.ergodox.js www/staticdist/layout.mrlergo.js $(WWW_SOURCES)
	cd ./www && npm run build:prod
	touch www/dist

.PHONY: www
www: www/node_modules www/dist ## Build the keymap.click website in production mode

# Watch the ui web component for changes and copy the output to www/public/keymap.click.js.
.PHONY: www.ui.watch
www.ui.watch: ui/node_modules
	cd ./ui && npm run keymap.click.watch

# Watch the keyboard.ergodox web component for changes and copy the output to www/public/keyboard.ergodox.js.
.PHONY: www.keyboard.ergodox.watch
www.keyboard.ergodox.watch: keyboard.ergodox/node_modules
	cd ./keyboard.ergodox && npm run keymap.click.watch

# Watch the layout.mrlergo web component for changes and copy the output to www/public/layout.mrlergo.js.
.PHONY: www.layout.mrlergo.watch
www.layout.mrlergo.watch: layout.mrlergo/node_modules
	cd ./layout.mrlergo && npm run keymap.click.watch

# Watch the keymap.click website for changes and run the eleventy server in dev mode
.PHONY: www.watch
www.watch: www/node_modules
	cd ./www && npm run serve:dev

.PHONY: www.serve
www.serve: ## Run the keymap.click website in development mode, automatically watching for changes and rebuilding
	@\
		$(MAKE) www.ui.watch & \
		$(MAKE) www.watch & \
		$(MAKE) www.keyboard.ergodox.watch & \
		$(MAKE) www.layout.mrlergo.watch & \
		wait

#endregion
