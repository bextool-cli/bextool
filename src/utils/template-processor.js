import fs from "fs-extra";
import Handlebars from "handlebars";
import path from "path";

Handlebars.registerHelper("json", (value) => JSON.stringify(value, null, 2));
Handlebars.registerHelper("eq", (left, right) => left === right);

function stripTemplateExtension(filePath) {
  return filePath.endsWith(".hbs") ? filePath.slice(0, -4) : filePath;
}

export async function renderTemplateDirectory({
  templateDir,
  targetDir,
  context,
}) {
  const entries = await fs.readdir(templateDir, { withFileTypes: true });
  await fs.ensureDir(targetDir);

  for (const entry of entries) {
    const sourcePath = path.join(templateDir, entry.name);
    const targetPath = path.join(targetDir, stripTemplateExtension(entry.name));

    if (entry.isDirectory()) {
      await renderTemplateDirectory({
        templateDir: sourcePath,
        targetDir: targetPath,
        context,
      });
      continue;
    }

    const template = await fs.readFile(sourcePath, "utf8");
    const compiled = Handlebars.compile(template, {
      noEscape: true,
    });

    await fs.outputFile(targetPath, compiled(context));
  }
}

export async function renderTemplateSubdirectories({
  templateRoot,
  subdirectories,
  targetDir,
  context,
}) {
  for (const subdirectory of subdirectories) {
    await renderTemplateDirectory({
      templateDir: path.join(templateRoot, subdirectory),
      targetDir,
      context,
    });
  }
}
