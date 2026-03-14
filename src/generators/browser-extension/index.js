import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { buildBrowserManifest } from "../../utils/browser-configs.js";
import { renderTemplateDirectory, renderTemplateSubdirectories } from "../../utils/template-processor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRoot = path.resolve(__dirname, "../../../templates/browser-extension");

function includesPopup(templateType) {
  return templateType === "popup" || templateType === "full";
}

function includesBackground(templateType) {
  return templateType !== "content";
}

function includesContent(templateType) {
  return templateType === "content" || templateType === "full";
}

export default {
  async generate({ targetPath, context }) {
    await renderTemplateDirectory({
      templateDir: path.join(templatesRoot, "base"),
      targetDir: targetPath,
      context,
    });

    const selectedSubdirs = [];
    if (includesPopup(context.templateType)) selectedSubdirs.push("popup");
    if (includesBackground(context.templateType)) selectedSubdirs.push("background");
    if (includesContent(context.templateType)) selectedSubdirs.push("content");

    await renderTemplateSubdirectories({
      templateRoot: templatesRoot,
      subdirectories: selectedSubdirs,
      targetDir: targetPath,
      context,
    });

    const manifest = buildBrowserManifest(context);
    await fs.writeJSON(path.join(targetPath, `manifest.${context.browser}.json`), manifest, {
      spaces: 2,
    });

    await fs.outputFile(
      path.join(targetPath, "manifest.js"),
      `export { default } from "./manifest.${context.browser}.json" assert { type: "json" };\n`,
    );

    const iconSizes = [16, 48, 128];
    for (const size of iconSizes) {
      await fs.outputFile(path.join(targetPath, "icons", `icon${size}.png`), "");
    }
  },
};
