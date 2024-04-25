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
	cd ./webcomponent && npx eslint .
	cd ./site && npx eslint .

.PHONY: clean
clean: ## Clean up
	rm -rf webcomponent/dist
	rm -rf site/dist

#region webcomponent

WEBCOMPONENT_SOURCES = $(shell find webcomponent/src -type f)
TESTSITE_SEPARATE_SOURCES = $(shell find webcomponent/testsites/separate -type f)
TESTSITE_SIMPLE_SOURCES = $(shell find webcomponent/testsites/simple -type f)

webcomponent/node_modules: webcomponent/package.json webcomponent/package-lock.json
	cd ./webcomponent && npm install
	touch webcomponent/node_modules

webcomponent/dist/clickmap.js: webcomponent/node_modules $(WEBCOMPONENT_SOURCES)
	cd ./webcomponent && npm run build

.PHONY: clickmap
clickmap: webcomponent/node_modules webcomponent/dist/clickmap.js ## Build the webcomponent

webcomponent/dist/separate/index.html: webcomponent/dist/clickmap.js $(TESTSITE_SEPARATE_SOURCES)
	@rm -rf webcomponent/dist/separate >/dev/null || true
	mkdir -p webcomponent/dist
	cp -r webcomponent/testsites/separate webcomponent/dist/separate
	cp -r webcomponent/dist/clickmap.js* webcomponent/dist/separate/

.PHONY: test.separate
test.separate: webcomponent/dist/separate/index.html ## Build the separate test site for the webcomponent

.PHONY: test.separate.dev
test.separate.dev: webcomponent/dist/separate/index.html ## Run a server for the separate test site for the webcomponent and open a browser
	node webcomponent/scripts/nodeserver.cjs webcomponent/dist/separate

.PHONY: test.simple.dev
test.simple.dev: webcomponent/node_modules ## Run the simple test site for the webcomponent
	cd ./webcomponent && npm run simple.dev

#endregion

#region keymap.click website

SITESOURCES = $(shell find site -type f -not \( -path "site/dist" -o -path "site/node_modules" \))

site/node_modules: site/package.json
	cd ./site && npm install
	touch site/node_modules

site/dist: site/package.json site/node_modules $(SITESOURCES)
	cd ./site && npm run build

.PHONY: keymap.click
keymap.click: site/node_modules site/dist ## Build the keymap.click website

# Watch the webcomponent for changes and copy the output to site/public/clickmap.js.
.PHONY: keymap.click.clickmap.watch
keymap.click.clickmap.watch: webcomponent/node_modules
	cd ./webcomponent && npm run keymap.click.watch

# Watch the keymap.click website for changes and run the eleventy server.
.PHONY: keymap.click.watch
keymap.click.watch: site/node_modules
	cd ./site && npm run dev

.PHONY: keymap.click.dev
keymap.click.dev: ## Run the keymap.click website in development mode, automatically watching for changes and rebuilding
	@\
		$(MAKE) keymap.click.clickmap.watch & \
		$(MAKE) keymap.click.watch & \
		wait

#endregion

