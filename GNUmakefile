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

# Fail if any command fails.
# Note that just because we're using GNU Make doesn't mean we're using Bash.
.SHELLFLAGS := -eu

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
	rm -rf www/dist

#region keymap.click.ui

UI_SOURCES = $(shell find ui/src -type f)
TESTSITE_SEPARATE_SOURCES = $(shell find ui/testsites/separate -type f)
TESTSITE_SIMPLE_SOURCES = $(shell find ui/testsites/simple -type f)

ui/node_modules: ui/package.json ui/package-lock.json
	cd ./ui && npm install
	touch ui/node_modules

ui/dist/keymap.click.js: ui/node_modules $(UI_SOURCES)
	cd ./ui && npm run build

.PHONY: ui
ui: ui/node_modules ui/dist/keymap.click.js ## Build the ui

ui/dist/separate/index.html: ui/dist/keymap.click.js $(TESTSITE_SEPARATE_SOURCES)
	@rm -rf ui/dist/separate >/dev/null || true
	mkdir -p ui/dist
	cp -r ui/testsites/separate ui/dist/separate
	cp -r ui/dist/keymap.click.js* ui/dist/separate/

.PHONY: ui.test.separate
ui.test.separate: ui/dist/separate/index.html ## Build the separate test site for the ui

.PHONY: ui.test.separate.dev
ui.test.separate.dev: ui/dist/separate/index.html ## Run a server for the separate test site for the ui and open a browser
	node ui/scripts/nodeserver.cjs ui/dist/separate

.PHONY: ui.test.simple.dev
ui.test.simple.dev: ui/node_modules ## Run the simple test site for the ui
	cd ./ui && npm run simple.dev

#endregion

#region keymap.click.www

WWW_SOURCES = $(shell find www -type f -not \( -path "www/dist" -o -path "www/node_modules" \))

www/node_modules: www/package.json
	cd ./www && npm install
	touch www/node_modules

www/dist: www/package.json www/node_modules $(WWW_SOURCES)
	cd ./www && npm run build

.PHONY: www
www: www/node_modules www/dist ## Build the keymap.click website

# Watch the ui for changes and copy the output to www/public/keymap.click.js.
.PHONY: www.ui.watch
www.ui.watch: ui/node_modules
	cd ./ui && npm run keymap.click.watch

# Watch the keymap.click website for changes and run the eleventy server.
.PHONY: www.watch
www.watch: www/node_modules
	cd ./www && npm run dev

.PHONY: www.dev
www.dev: ## Run the keymap.click website in development mode, automatically watching for changes and rebuilding
	@\
		$(MAKE) www.ui.watch & \
		$(MAKE) www.watch & \
		wait

#endregion

