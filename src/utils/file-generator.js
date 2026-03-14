import browserExtensionGenerator from "../generators/browser-extension/index.js";

function slugifyProjectName(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

export const fileGenerator = {
  async generate(config) {
    const projectSlug = slugifyProjectName(config.projectName);

    await browserExtensionGenerator.generate({
      framework: {
        templateDir: "browser-extension",
      },
      targetPath: config.targetPath,
      context: {
        ...config,
        packageName: projectSlug,
        projectSlug,
      },
    });
  },
};
