#!/usr/bin/env node

import * as p from "@clack/prompts";
import fs from "fs-extra";
import kleur from "kleur";
import path from "path";
import { execa } from "execa";
import {
  categoryChoices,
  frameworkChoicesByCategory,
  frameworkRegistry,
} from "./config/frameworks.js";

const theme = {
  primary(text) {
    return kleur.bold().yellow(text);
  },
  soft(text) {
    return kleur.cyan(text);
  },
  step(text) {
    return kleur.bgWhite().black(text);
  },
};

function handleCancel(value) {
  if (p.isCancel(value)) {
    p.cancel(kleur.yellow("Setup cancelled. No files were created."));
    process.exit(0);
  }

  return value;
}

function sectionTitle(step, title) {
  return `${theme.step(` ${step} `)} ${kleur.bold(theme.soft(title))}`;
}

function slugifyProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

function buildContext(projectName, description, version, packageManager, answers) {
  const safeProjectName = slugifyProjectName(projectName);
  const className = projectName
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  return {
    projectName,
    packageName: safeProjectName,
    projectSlug: safeProjectName,
    description,
    version,
    packageManager,
    className: className || "StarterProject",
    ...answers,
  };
}

async function askPrompt(promptConfig) {
  const common = {
    message: promptConfig.message,
    initialValue: promptConfig.initialValue,
    placeholder: promptConfig.placeholder,
    options: promptConfig.options,
    required: promptConfig.required,
  };

  switch (promptConfig.type) {
    case "confirm":
      return p.confirm(common);
    case "multiselect":
      return p.multiselect(common);
    case "select":
      return p.select(common);
    case "text":
    default:
      return p.text({
        ...common,
        validate: promptConfig.validate,
      });
  }
}

async function runFrameworkPrompts(framework) {
  const answers = {};

  for (const promptConfig of framework.prompts ?? []) {
    const value = handleCancel(await askPrompt(promptConfig));
    answers[promptConfig.name] = value;
  }

  return answers;
}

function renderSummary({ category, framework, targetPath, installDependencies, context }) {
  const lines = [
    `${kleur.bold("Category")}      ${categoryChoices.find((item) => item.value === category)?.label ?? category}`,
    `${kleur.bold("Framework")}     ${framework.name}`,
    `${kleur.bold("Project")}       ${context.projectName}`,
    `${kleur.bold("Description")}   ${context.description || kleur.dim("none")}`,
    `${kleur.bold("Version")}       ${context.version}`,
    `${kleur.bold("Directory")}     ${targetPath}`,
  ];

  if (framework.usesPackageManager) {
    lines.push(`${kleur.bold("Package mgr")}   ${context.packageManager}`);
  }

  if (framework.summary) {
    lines.push(...framework.summary(context));
  }

  lines.push(
    `${kleur.bold("Install deps")}  ${installDependencies ? "yes" : "no"}`,
  );

  return lines.join("\n");
}

async function runInstall(packageManager, targetPath) {
  const installArgsByManager = {
    npm: ["install"],
    pnpm: ["install"],
    yarn: [],
  };

  const args = installArgsByManager[packageManager] ?? ["install"];
  await execa(packageManager, args, {
    cwd: targetPath,
    stdio: "inherit",
  });
}

async function loadGenerator(framework) {
  const module = await import(`./generators/${framework.generator}.js`);
  return module.default;
}

async function main() {
  console.clear();

  p.intro(
    [
      theme.primary("BEXTOOL"),
      theme.soft("Scaffold apps, CLIs, extensions, services, and more from one wizard."),
    ].join("\n"),
  );

  try {
    p.note(
      [
        "Use arrow keys to move, space to select, and Ctrl+C to exit.",
        "Choose a category first, then a framework, then the options that matter for that starter.",
      ].join("\n"),
      "Quick Guide",
    );

    const category = handleCancel(
      await p.select({
        message: sectionTitle("1", "Select project category"),
        options: categoryChoices,
        initialValue: "frontend",
      }),
    );

    const frameworkChoices = frameworkChoicesByCategory[category] ?? [];
    if (frameworkChoices.length === 0) {
      throw new Error(`No frameworks are registered for category "${category}".`);
    }

    const frameworkId = handleCancel(
      await p.select({
        message: sectionTitle("2", "Choose a framework"),
        options: frameworkChoices,
      }),
    );

    const framework = frameworkRegistry[frameworkId];
    if (!framework) {
      throw new Error(`Unknown framework "${frameworkId}".`);
    }

    const projectName = handleCancel(
      await p.text({
        message: sectionTitle("3", "Project name"),
        placeholder: framework.defaultProjectName ?? "my-app",
        initialValue: framework.defaultProjectName ?? "",
        validate(value) {
          if (!value?.trim()) return "Project name is required";
          if (value.trim() === ".") return "Please choose a more descriptive folder name";
          return undefined;
        },
      }),
    );

    const description = handleCancel(
      await p.text({
        message: sectionTitle("4", "Description"),
        placeholder: framework.defaultDescription ?? `A ${framework.name} project`,
        initialValue: framework.defaultDescription ?? "",
      }),
    );

    const version = handleCancel(
      await p.text({
        message: sectionTitle("5", "Initial version"),
        initialValue: framework.defaultVersion ?? "0.1.0",
        placeholder: "0.1.0",
      }),
    );

    let packageManager = null;
    if (framework.usesPackageManager) {
      packageManager = handleCancel(
        await p.select({
          message: sectionTitle("6", "Package manager"),
          options: [
            { value: "npm", label: "npm", hint: "Works everywhere" },
            { value: "pnpm", label: "pnpm", hint: "Fast and space efficient" },
            { value: "yarn", label: "yarn", hint: "Classic JavaScript workflow" },
          ],
          initialValue: "npm",
        }),
      );
    }

    const answers = await runFrameworkPrompts(framework);
    const targetPath = path.join(process.cwd(), projectName);

    if (await fs.pathExists(targetPath)) {
      throw new Error(`Target directory already exists: ${targetPath}`);
    }

    const installDependencies = framework.usesPackageManager
      ? handleCancel(
          await p.confirm({
            message: "Install dependencies after scaffolding?",
            initialValue: true,
          }),
        )
      : false;

    const context = buildContext(
      projectName,
      description,
      version,
      packageManager,
      answers,
    );

    p.note(
      renderSummary({
        category,
        framework,
        targetPath,
        installDependencies,
        context,
      }),
      "Build Summary",
    );

    const shouldCreate = handleCancel(
      await p.confirm({
        message: "Create this project scaffold?",
        initialValue: true,
      }),
    );

    if (!shouldCreate) {
      p.cancel(kleur.yellow("Setup cancelled before file generation."));
      process.exit(0);
    }

    const generator = await loadGenerator(framework);
    const spinner = p.spinner();

    spinner.start(`Generating ${framework.name} project`);
    await generator.generate({
      framework,
      targetPath,
      context,
    });
    spinner.stop("Project files created");

    if (installDependencies && packageManager) {
      spinner.start(`Installing dependencies with ${packageManager}`);
      try {
        await runInstall(packageManager, targetPath);
        spinner.stop("Dependencies installed");
      } catch (error) {
        spinner.stop("Dependency installation failed");
        p.note(
          `Run ${packageManager === "yarn" ? "yarn" : `${packageManager} install`} inside ${projectName} when you're ready.`,
          "Manual Step",
        );
      }
    }

    p.outro(theme.primary(`${framework.name} scaffold ready.`));

    const nextSteps = [`cd ${projectName}`];
    if (framework.usesPackageManager && !installDependencies && packageManager) {
      nextSteps.push(packageManager === "yarn" ? "yarn" : `${packageManager} install`);
    }
    nextSteps.push(...(framework.nextSteps?.(context) ?? []));

    p.note(nextSteps.join("\n"), "Next Steps");
  } catch (error) {
    p.cancel(kleur.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main();
