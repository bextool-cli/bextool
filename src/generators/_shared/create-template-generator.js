import path from "path";
import { fileURLToPath } from "url";
import { renderTemplateDirectory } from "../../utils/template-processor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRoot = path.resolve(__dirname, "../../../templates");

export function createTemplateGenerator({ templateDir, mapContext, afterGenerate }) {
  return {
    async generate({ framework, targetPath, context }) {
      const finalContext = mapContext ? mapContext(context, framework) : context;

      await renderTemplateDirectory({
        templateDir: path.join(templatesRoot, templateDir ?? framework.templateDir),
        targetDir: targetPath,
        context: finalContext,
      });

      if (afterGenerate) {
        await afterGenerate({
          framework,
          targetPath,
          context: finalContext,
        });
      }
    },
  };
}
