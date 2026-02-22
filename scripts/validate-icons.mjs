import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const iconsRoot = path.join(repoRoot, "icons");
const indexPath = path.join(repoRoot, "index.json");

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function listFlatSvgFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  const nestedDirs = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      nestedDirs.push(entry.name);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".svg")) {
      files.push(entry.name);
    }
  }

  return { files, nestedDirs };
}

async function main() {
  const errors = [];
  let svgFiles = [];

  try {
    const { files, nestedDirs } = await listFlatSvgFiles(iconsRoot);
    svgFiles = files;
    if (nestedDirs.length > 0) {
      errors.push(`icons directory must be flat, found subdirectories: ${nestedDirs.join(", ")}`);
    }
  } catch {
    errors.push("Missing icons directory.");
  }

  const svgNameSet = new Set(svgFiles.map((filename) => filename.replace(/\.svg$/, "")));

  for (const filename of svgFiles) {
    const name = filename.replace(/\.svg$/, "");

    if (!namePattern.test(name)) {
      errors.push(`Invalid file name '${name}' in icons/${filename}`);
    }

    const filePath = path.join(iconsRoot, filename);
    const content = await fs.readFile(filePath, "utf8");
    if (!content.includes("<svg")) {
      errors.push(`Missing <svg> tag in icons/${filename}`);
    }
  }

  try {
    const indexRaw = await fs.readFile(indexPath, "utf8");
    const indexData = JSON.parse(indexRaw);
    ensure(Array.isArray(indexData), "index.json must be an array");

    const seenIds = new Set();
    const seenNames = new Set();

    for (const item of indexData) {
      const required = ["id", "name", "category", "tags", "url", "deprecated", "updatedAt"];
      for (const key of required) {
        if (!(key in item)) {
          errors.push(`index.json item missing key '${key}'`);
        }
      }

      if (item.id) {
        if (seenIds.has(item.id)) {
          errors.push(`index.json duplicate id '${item.id}'`);
        }
        seenIds.add(item.id);
      }

      if (item.name) {
        if (!namePattern.test(item.name)) {
          errors.push(`index.json invalid name '${item.name}'`);
        }
        if (seenNames.has(item.name)) {
          errors.push(`index.json duplicate name '${item.name}'`);
        }
        seenNames.add(item.name);

        if (!svgNameSet.has(item.name)) {
          errors.push(`index.json points to missing file icons/${item.name}.svg`);
        }
      }

      if (item.url && item.name) {
        const urlNameMatch = item.url.endsWith(`/icons/${item.name}.svg`);
        if (!urlNameMatch) {
          errors.push(`index.json url mismatch for '${item.id}'`);
        }
      }

      if (item.id && item.category && item.name && item.id !== `${item.category}/${item.name}`) {
        errors.push(`index.json id mismatch for '${item.id}'`);
      }
    }
  } catch (error) {
    errors.push(`index.json invalid: ${error.message}`);
  }

  if (errors.length > 0) {
    console.error("Validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed. Checked ${svgFiles.length} SVG files.`);
}

await main();
