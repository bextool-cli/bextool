<p align="center">
  <img src="./public/logo.png" alt="BEXTOOL logo" width="220" />
</p>

<h1 align="center">bextool</h1>

<p align="center">
  A modern scaffolding CLI for generating apps, extensions, tooling, and starter projects from one guided workflow.
</p>

<p align="center">
  <a href="https://www.bextool.tech/">Website</a>
  ·
  <a href="https://github.com/bextool-cli/bextool">GitHub</a>
  ·
  <a href="https://github.com/bextool-cli/bextool/issues">Issues</a>
</p>

## Overview

`bextool` helps developers bootstrap common project types quickly without juggling multiple generators, starter repos, or copy-paste setup steps.

The CLI provides:

- a category-first interactive flow powered by `@clack/prompts`
- a registry-driven architecture for adding new frameworks cleanly
- a Handlebars template system for flexible file generation
- optional dependency installation with `npm`, `pnpm`, or `yarn`
- smoke-tested generators across all currently registered scaffolds

Official website: `https://www.bextool.tech/`

## Supported Project Types

- Frontend: React + Vite
- Backend: Node.js + Express
- Full-Stack: Next.js App Router
- Mobile: React Native with Expo
- Static Site: Hugo
- CLI Tool: Commander
- Game: Phaser
- Browser Extension: Chrome, Firefox, Edge, Safari
- Editor Extension: VS Code
- CMS: WordPress theme
- Data Science: Jupyter notebook starter
- Microservice: Docker Compose
- NPM Package: TypeScript library with Rollup and Vitest
- Desktop App: Electron
- Workflow Automation: n8n workflow starter

## Why Use bextool

- One CLI for many project categories.
- Sensible defaults with minimal setup friction.
- Templates are easy to inspect, customize, and extend.
- Browser extensions remain first-class, with Chrome, Firefox, Edge, and Safari support.
- The codebase is structured for long-term growth under `src/config`, `src/generators`, and `templates`.

## Installation

Install globally:

```bash
npm install -g bextool
```

Or use it locally from this repository:

```bash
npm install
npm start
```

## Quick Start

Run the CLI:

```bash
bextool
```

Scaffold apps, extensions, and developer tooling from one guided flow.

The flow will:

1. Ask which project category you want to create.
2. Ask which framework or starter you want inside that category.
3. Collect project metadata such as name, description, version, and package manager.
4. Ask framework-specific questions when needed.
5. Generate the matching template files.
6. Optionally install dependencies.

## Example Workflows

Create a frontend app:

```bash
bextool
```

Then choose:

- `Frontend`
- `React + Vite`

Create a browser extension:

```bash
bextool
```

Then choose:

- `Browser Extension`
- target browser
- starter type
- permissions

## Development

Install dependencies:

```bash
npm install
```

Run the CLI locally:

```bash
npm start
```

Run verification:

```bash
npm test
```

That test suite includes:

- syntax checks for all `src/**/*.js` files
- scaffold smoke tests for every registered framework
- browser-extension matrix checks across all supported browsers and starter modes

## Project Structure

```text
src/
  config/
  generators/
  utils/
templates/
  frontend/
  backend/
  full-stack/
  mobile/
  static-site/
  cli-tool/
  game/
  browser-extension/
  editor-extension/
  cms/
  data-science/
  microservice/
  npm-package/
  desktop/
  workflow-automation/
scripts/
  check.js
  smoke-test.js
public/
  logo.png
```

## Extending bextool

To add a new scaffold:

1. Add a template folder under `templates/`.
2. Add a generator module under `src/generators/`.
3. Register the new framework in `src/config/frameworks.js`.

This keeps the CLI maintainable while making future expansion straightforward.

## Package Metadata

- Package name: `bextool`
- Homepage: `https://www.bextool.tech/`
- Node.js: `>=18`
- Module type: `ESM`

## License

ISC