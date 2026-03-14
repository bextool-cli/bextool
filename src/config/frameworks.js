function packageScript(packageManager, scriptName) {
  if (!packageManager) {
    return scriptName;
  }

  if (packageManager === "yarn") {
    return `yarn ${scriptName}`;
  }

  return `${packageManager} run ${scriptName}`;
}

function packageTestCommand(packageManager) {
  return packageManager === "yarn" ? "yarn test" : `${packageManager ?? "npm"} test`;
}

const browserChoices = [
  { value: "chrome", label: "Chrome", hint: "Manifest V3" },
  { value: "firefox", label: "Firefox", hint: "Manifest V2 compatibility" },
  { value: "edge", label: "Edge", hint: "Manifest V3" },
  { value: "safari", label: "Safari", hint: "Experimental MV3 starter" },
];

const extensionStarterChoices = [
  { value: "popup", label: "Popup", hint: "Toolbar UI only" },
  { value: "content", label: "Content script", hint: "Page injection starter" },
  { value: "background", label: "Background", hint: "Background logic only" },
  { value: "full", label: "Full starter", hint: "Popup, background, and content" },
];

const permissionChoices = [
  { value: "storage", label: "Storage", hint: "Persist extension data" },
  { value: "tabs", label: "Tabs", hint: "Inspect and update tabs" },
  { value: "activeTab", label: "Active tab", hint: "Access the current tab" },
  { value: "webNavigation", label: "Web navigation", hint: "Observe navigation events" },
  { value: "bookmarks", label: "Bookmarks", hint: "Read bookmark data" },
  { value: "history", label: "History", hint: "Read browsing history" },
];

export const categoryChoices = [
  { value: "frontend", label: "Frontend", hint: "Web UI starters" },
  { value: "backend", label: "Backend", hint: "APIs and services" },
  { value: "full-stack", label: "Full-Stack", hint: "Frontend plus backend" },
  { value: "mobile", label: "Mobile", hint: "Native and hybrid apps" },
  { value: "static-site", label: "Static Site", hint: "Content-focused websites" },
  { value: "cli-tool", label: "CLI Tool", hint: "Command-line utilities" },
  { value: "game", label: "Game", hint: "Interactive game starters" },
  { value: "browser-extension", label: "Browser Extension", hint: "Chrome, Firefox, Edge, Safari" },
  { value: "editor-extension", label: "Editor Extension", hint: "Editor and IDE plugins" },
  { value: "cms", label: "CMS (WordPress)", hint: "Themes and plugins" },
  { value: "data-science", label: "Data Science", hint: "Notebooks and analysis" },
  { value: "microservice", label: "Microservice", hint: "Containers and deployment" },
  { value: "npm-package", label: "NPM Package", hint: "Reusable libraries" },
  { value: "desktop-app", label: "Desktop App", hint: "Cross-platform desktop apps" },
  { value: "workflow-automation", label: "Workflow Automation", hint: "Flows and integrations" },
];

export const frameworkRegistry = {
  "react-vite": {
    id: "react-vite",
    name: "React + Vite",
    category: "frontend",
    generator: "frontend/react-vite",
    templateDir: "frontend/react-vite",
    defaultProjectName: "react-vite-starter",
    defaultDescription: "A React app scaffolded with Vite",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "typescript",
        type: "confirm",
        message: "Use TypeScript-ready settings and naming hints?",
        initialValue: false,
      },
    ],
    nextSteps: (context) => [packageScript(context.packageManager, "dev")],
  },
  express: {
    id: "express",
    name: "Node.js + Express",
    category: "backend",
    generator: "backend/express",
    templateDir: "backend/express",
    defaultProjectName: "express-api",
    defaultDescription: "An Express API starter",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "port",
        type: "text",
        message: "Default server port",
        initialValue: "3000",
      },
    ],
    nextSteps: (context) => [packageScript(context.packageManager, "dev")],
  },
  "next-app": {
    id: "next-app",
    name: "Next.js",
    category: "full-stack",
    generator: "full-stack/next-app",
    templateDir: "full-stack/next-app",
    defaultProjectName: "next-app",
    defaultDescription: "A Next.js App Router app with a route handler",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [],
    nextSteps: (context) => [packageScript(context.packageManager, "dev")],
  },
  "react-native-expo": {
    id: "react-native-expo",
    name: "React Native (Expo)",
    category: "mobile",
    generator: "mobile/react-native-expo",
    templateDir: "mobile/react-native-expo",
    defaultProjectName: "expo-app",
    defaultDescription: "An Expo-powered React Native app",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "appIdentifier",
        type: "text",
        message: "Expo bundle identifier",
        initialValue: "com.example.app",
      },
    ],
    nextSteps: (context) => [packageScript(context.packageManager, "start")],
  },
  hugo: {
    id: "hugo",
    name: "Hugo",
    category: "static-site",
    generator: "static-site/hugo",
    templateDir: "static-site/hugo",
    defaultProjectName: "hugo-site",
    defaultDescription: "A Hugo static site",
    defaultVersion: "0.1.0",
    usesPackageManager: false,
    prompts: [
      {
        name: "baseUrl",
        type: "text",
        message: "Base URL",
        initialValue: "https://example.com/",
      },
    ],
    nextSteps: () => ["hugo server -D"],
  },
  commander: {
    id: "commander",
    name: "Commander CLI",
    category: "cli-tool",
    generator: "cli-tool/commander",
    templateDir: "cli-tool/commander",
    defaultProjectName: "commander-cli",
    defaultDescription: "A CLI scaffold built with Commander",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "binName",
        type: "text",
        message: "CLI command name",
        initialValue: "my-cli",
      },
    ],
    nextSteps: (context) => [`node ./src/index.js hello ${context.projectName}`],
  },
  phaser: {
    id: "phaser",
    name: "Phaser",
    category: "game",
    generator: "game/phaser",
    templateDir: "game/phaser",
    defaultProjectName: "phaser-game",
    defaultDescription: "A Phaser browser game starter",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [],
    nextSteps: (context) => [packageScript(context.packageManager, "dev")],
  },
  "browser-extension": {
    id: "browser-extension",
    name: "Browser Extension",
    category: "browser-extension",
    generator: "browser-extension/index",
    templateDir: "browser-extension",
    defaultProjectName: "browser-extension",
    defaultDescription: "A browser extension scaffold",
    defaultVersion: "1.0.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "browser",
        type: "select",
        message: "Target browser",
        initialValue: "chrome",
        options: browserChoices,
      },
      {
        name: "templateType",
        type: "select",
        message: "Starter type",
        initialValue: "full",
        options: extensionStarterChoices,
      },
      {
        name: "permissions",
        type: "multiselect",
        message: "Permissions",
        options: permissionChoices,
        required: false,
      },
    ],
    summary: (context) => [
      `${"Browser".padEnd(14)} ${context.browser}`,
      `${"Starter".padEnd(14)} ${context.templateType}`,
      `${"Permissions".padEnd(14)} ${(context.permissions?.length ?? 0) > 0 ? context.permissions.join(", ") : "none"}`,
    ],
    nextSteps: (context) => [packageScript(context.packageManager, "dev")],
  },
  "vscode-extension": {
    id: "vscode-extension",
    name: "VS Code Extension",
    category: "editor-extension",
    generator: "editor-extension/vscode",
    templateDir: "editor-extension/vscode",
    defaultProjectName: "vscode-extension",
    defaultDescription: "A VS Code extension starter",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "commandId",
        type: "text",
        message: "Command identifier",
        initialValue: "starter.helloWorld",
      },
      {
        name: "activationEvent",
        type: "text",
        message: "Activation event",
        initialValue: "onCommand:starter.helloWorld",
      },
    ],
    nextSteps: (context) => [packageScript(context.packageManager, "package")],
  },
  "wordpress-theme": {
    id: "wordpress-theme",
    name: "WordPress Theme",
    category: "cms",
    generator: "cms/wordpress-theme",
    templateDir: "cms/wordpress-theme",
    defaultProjectName: "wp-theme",
    defaultDescription: "A custom WordPress theme starter",
    defaultVersion: "0.1.0",
    usesPackageManager: false,
    prompts: [
      {
        name: "author",
        type: "text",
        message: "Theme author",
        initialValue: "Your Name",
      },
    ],
    nextSteps: () => ["Copy the theme folder into wp-content/themes/"],
  },
  jupyter: {
    id: "jupyter",
    name: "Jupyter Notebook",
    category: "data-science",
    generator: "data-science/jupyter",
    templateDir: "data-science/jupyter",
    defaultProjectName: "jupyter-project",
    defaultDescription: "A notebook-first data science starter",
    defaultVersion: "0.1.0",
    usesPackageManager: false,
    prompts: [
      {
        name: "pythonVersion",
        type: "text",
        message: "Python version",
        initialValue: "3.11",
      },
    ],
    nextSteps: () => ["python -m venv .venv", "jupyter notebook notebooks/starter.ipynb"],
  },
  "docker-compose": {
    id: "docker-compose",
    name: "Docker Compose",
    category: "microservice",
    generator: "microservice/docker-compose",
    templateDir: "microservice/docker-compose",
    defaultProjectName: "compose-stack",
    defaultDescription: "A Docker Compose microservice starter",
    defaultVersion: "0.1.0",
    usesPackageManager: false,
    prompts: [
      {
        name: "apiPort",
        type: "text",
        message: "API port",
        initialValue: "8080",
      },
    ],
    nextSteps: () => ["docker compose up --build"],
  },
  "npm-library": {
    id: "npm-library",
    name: "NPM Package",
    category: "npm-package",
    generator: "npm-package/library",
    templateDir: "npm-package/library",
    defaultProjectName: "my-library",
    defaultDescription: "A TypeScript library with Rollup and Vitest",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [
      {
        name: "entryExport",
        type: "text",
        message: "Primary exported function name",
        initialValue: "createGreeting",
      },
    ],
    nextSteps: (context) => [
      packageScript(context.packageManager, "build"),
      packageTestCommand(context.packageManager),
    ],
  },
  electron: {
    id: "electron",
    name: "Electron",
    category: "desktop-app",
    generator: "desktop/electron",
    templateDir: "desktop/electron",
    defaultProjectName: "electron-app",
    defaultDescription: "An Electron desktop app starter",
    defaultVersion: "0.1.0",
    usesPackageManager: true,
    prompts: [],
    nextSteps: (context) => [context.packageManager === "yarn" ? "yarn start" : `${context.packageManager ?? "npm"} start`],
  },
  n8n: {
    id: "n8n",
    name: "n8n Workflow",
    category: "workflow-automation",
    generator: "workflow-automation/n8n",
    templateDir: "workflow-automation/n8n",
    defaultProjectName: "n8n-workflow",
    defaultDescription: "A starter n8n workflow project",
    defaultVersion: "0.1.0",
    usesPackageManager: false,
    prompts: [
      {
        name: "workflowName",
        type: "text",
        message: "Workflow display name",
        initialValue: "Hello Workflow",
      },
    ],
    nextSteps: () => ["Import workflows/hello-workflow.json into n8n"],
  },
};

export const frameworkChoicesByCategory = Object.values(frameworkRegistry).reduce(
  (accumulator, framework) => {
    if (!accumulator[framework.category]) {
      accumulator[framework.category] = [];
    }

    accumulator[framework.category].push({
      value: framework.id,
      label: framework.name,
      hint: framework.defaultDescription,
    });

    return accumulator;
  },
  {},
);
