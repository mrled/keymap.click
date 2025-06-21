# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KeymapKit is a web application for visualizing and explaining keyboard layouts, specifically showing how an ErgoDox keyboard helped with RSI (Repetitive Strain Injury). The project is currently migrating from React/Next.js to vanilla JavaScript with web components.

## Build Commands

### Development

- `make www.serve` - Run development server with hot reloading (recommended for development)
- `make help` - Show all available make targets

### Building Individual Modules

- `make ui` - Build the UI library
- `make keyboard.ergodox` - Build the ErgoDox keyboard module
- `make layout.mrlergo` - Build the layout module
- `make www` - Build the website for production

### Code Quality

- `make lint` - Run ESLint on ui/ and www/ directories
- Code formatting uses Prettier with default settings

### Clean

- `make clean` - Remove all build artifacts

## Architecture

### Web Components Migration

The project is migrating from React/Next.js to vanilla JavaScript web components. Key principles:

- Create reusable components that can be embedded in any webpage
- Use native web APIs and custom elements
- Minimize dependencies and framework lock-in

### Module Structure

The codebase consists of three main TypeScript modules with file-based dependencies:

1. `@keymapkit/ui` - Core UI components and utilities
2. `@keymapkit/keyboard.ergodox` - ErgoDox keyboard model (depends on ui)
3. `@keymapkit/layout.mrlergo` - Custom layout definitions (depends on ui and keyboard.ergodox)

### Build System

- GNU Make orchestrates the build at the top level (uses bash shell)
- Each module uses esbuild for fast TypeScript bundling
- TypeScript compiler generates type declarations
- Eleventy (11ty) generates the static website

### Key Web Components

Located in `ui/src/webcomponents/`:

- `keymap-ui` - Main UI component
- `keymap-keyboard` - Keyboard visualization
- `keymap-diagram` - Connection diagrams between keys and explanations
- `keymap-key` - Individual key representation
- `keymap-keygrid` - Grid layout for keys

## Development Workflow

1. Install dependencies: `npm install` in the root directory
2. Run development server: `make www.serve`
3. The development server runs multiple watch processes in parallel for hot reloading
4. Make changes to TypeScript files in the respective module's src/ directory
5. Changes are automatically rebuilt and reflected in the browser

## Important Notes

- When working with web components, follow the existing patterns in `ui/src/webcomponents/`
- CSS is loaded as text in the build process (see esbuild config: `--loader:.css=text`)
- The project outputs ES modules (`--format=esm`)
- Production builds are minified
- No test framework is currently set up - rely on visual verification during development
- The website content lives in `www/` and uses Eleventy with markdown files
