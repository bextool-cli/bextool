# bextool

`bextool` is a multi-project scaffolding CLI for generating modern starter apps from one interactive flow.

It uses `@clack/prompts` for the terminal experience, `handlebars` for template rendering, and a registry-driven generator system so new scaffolds are easy to add.

## Supported Starters

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

## Features

- Category-first project selection
- Framework-specific prompts
- Handlebars-based template rendering
- Optional dependency installation with `npm`, `pnpm`, or `yarn`
- Modular generator architecture under `src/generators`
- Expandable framework registry in `src/config/frameworks.js`

## Installation

```bash
npm install -g bextool
```

Or run it locally from this repository:

```bash
npm install
npm start
```

## Usage

```bash
bextool
```

The CLI will:

1. Ask for a project category.
2. Ask for a framework in that category.
3. Collect shared project metadata.
4. Ask any framework-specific questions.
5. Generate files from the matching template.
6. Optionally install dependencies.

## Development

```bash
npm test
```

That command runs:

- syntax checks for all `src/**/*.js` files
- scaffold smoke tests for every registered framework
- browser extension matrix checks across all supported browsers and starter modes

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
  ...
scripts/
  check.js
  smoke-test.js
```

## Extending The CLI

To add a new scaffold:

1. Add a template folder under `templates/`.
2. Add a generator module under `src/generators/`.
3. Register it in `src/config/frameworks.js`.

## License

ISC
