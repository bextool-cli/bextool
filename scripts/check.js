import fs from "fs-extra";
import path from "path";
import { execa } from "execa";

const srcRoot = path.resolve("src");

async function findJavaScriptFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findJavaScriptFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await findJavaScriptFiles(srcRoot);

for (const file of files) {
  await execa("node", ["--check", file], {
    stdio: "inherit",
  });
}

console.log(`Checked ${files.length} JavaScript files.`);
