import fs from "fs-extra";
import path from "path";
import { frameworkRegistry } from "../src/config/frameworks.js";

function slugifyProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function buildContext(projectName, framework, overrides = {}) {
  const projectSlug = slugifyProjectName(projectName);

  return {
    projectName,
    packageName: projectSlug,
    projectSlug,
    description: framework.defaultDescription ?? `Smoke test for ${framework.name}`,
    version: framework.defaultVersion ?? "0.1.0",
    packageManager: framework.usesPackageManager ? "npm" : null,
    className: "SmokeTestProject",
    ...overrides,
  };
}

function promptDefaults(framework) {
  const defaults = {};

  for (const prompt of framework.prompts ?? []) {
    if (prompt.type === "multiselect") {
      defaults[prompt.name] = Array.isArray(prompt.initialValue)
        ? prompt.initialValue
        : [];
      continue;
    }

    if (prompt.initialValue !== undefined) {
      defaults[prompt.name] = prompt.initialValue;
      continue;
    }

    if (prompt.type === "select" && Array.isArray(prompt.options) && prompt.options.length > 0) {
      defaults[prompt.name] = prompt.options[0].value;
      continue;
    }

    if (prompt.type === "confirm") {
      defaults[prompt.name] = false;
      continue;
    }

    defaults[prompt.name] = "";
  }

  return defaults;
}

async function loadGenerator(framework) {
  const module = await import(`../src/generators/${framework.generator}.js`);
  return module.default;
}

async function generateFixture({ framework, fixtureName, overrides = {} }) {
  const generator = await loadGenerator(framework);
  const targetPath = path.resolve(".tmp-smoke", fixtureName);
  const context = buildContext(fixtureName, framework, {
    ...promptDefaults(framework),
    ...overrides,
  });

  await fs.remove(targetPath);
  await generator.generate({
    framework,
    targetPath,
    context,
  });

  const generatedFiles = await fs.readdir(targetPath);
  if (generatedFiles.length === 0) {
    throw new Error(`No files were generated for ${framework.id}`);
  }

  if (framework.usesPackageManager) {
    const packageJsonPath = path.join(targetPath, "package.json");
    if (!(await fs.pathExists(packageJsonPath))) {
      throw new Error(`Missing package.json for ${framework.id}`);
    }
  }

  if (framework.nextSteps) {
    const nextSteps = framework.nextSteps(context);
    if (!Array.isArray(nextSteps) || nextSteps.length === 0) {
      throw new Error(`Invalid next steps for ${framework.id}`);
    }
  }

  return targetPath;
}

async function verifyBrowserExtensionVariants() {
  const framework = frameworkRegistry["browser-extension"];
  const browsers = ["chrome", "firefox", "edge", "safari"];
  const starterTypes = ["popup", "content", "background", "full"];

  for (const browser of browsers) {
    for (const templateType of starterTypes) {
      const fixtureName = `browser-extension-${browser}-${templateType}`;
      const targetPath = await generateFixture({
        framework,
        fixtureName,
        overrides: {
          browser,
          templateType,
          permissions: ["storage"],
        },
      });

      const manifestPath = path.join(targetPath, `manifest.${browser}.json`);
      if (!(await fs.pathExists(manifestPath))) {
        throw new Error(`Missing ${path.basename(manifestPath)} for ${fixtureName}`);
      }
    }
  }
}

async function verifyPackageManagerNextSteps() {
  for (const framework of Object.values(frameworkRegistry)) {
    if (!framework.usesPackageManager || !framework.nextSteps) {
      continue;
    }

    for (const packageManager of ["npm", "pnpm", "yarn"]) {
      const context = buildContext(`${framework.id}-${packageManager}`, framework, {
        ...promptDefaults(framework),
        packageManager,
      });

      const nextSteps = framework.nextSteps(context);
      if (!Array.isArray(nextSteps) || nextSteps.some((step) => typeof step !== "string" || !step.trim())) {
        throw new Error(`Invalid next steps for ${framework.id} using ${packageManager}`);
      }
    }
  }
}

async function main() {
  const root = path.resolve(".tmp-smoke");
  await fs.remove(root);
  await fs.ensureDir(root);

  const failures = [];

  try {
    for (const framework of Object.values(frameworkRegistry)) {
      if (framework.id === "browser-extension") {
        continue;
      }

      try {
        await generateFixture({
          framework,
          fixtureName: framework.id,
        });
        console.log(`PASS ${framework.id}`);
      } catch (error) {
        failures.push(`FAIL ${framework.id}: ${error.message}`);
      }
    }

    try {
      await verifyBrowserExtensionVariants();
      console.log("PASS browser-extension variants");
    } catch (error) {
      failures.push(`FAIL browser-extension variants: ${error.message}`);
    }

    try {
      await verifyPackageManagerNextSteps();
      console.log("PASS package-manager next steps");
    } catch (error) {
      failures.push(`FAIL package-manager next steps: ${error.message}`);
    }
  } finally {
    await fs.remove(root);
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(failure);
    }
    process.exit(1);
  }

  console.log("All scaffold smoke tests passed.");
}

await main();
