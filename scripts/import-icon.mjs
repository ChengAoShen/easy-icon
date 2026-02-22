import fs from "node:fs/promises";
import path from "node:path";

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const maxBatchCount = 100;

function readRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function checkDomainAllowed(rawUrl, allowlistText) {
  const url = new URL(rawUrl);
  const allowedDomains = allowlistText
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  if (allowedDomains.length === 0) {
    throw new Error("ALLOWED_DOMAINS is empty");
  }

  const host = url.hostname.toLowerCase();
  const allowed = allowedDomains.some((d) => host === d || host.endsWith(`.${d}`));
  if (!allowed) {
    throw new Error(`Domain not allowed: ${host}`);
  }
}

function parseTags(raw) {
  if (Array.isArray(raw)) {
    return raw.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean);
  }

  return String(raw || "")
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

function ensureCategory(category) {
  if (!String(category || "").trim()) {
    throw new Error(`Invalid category: ${category}`);
  }
}

function ensureName(name) {
  if (!namePattern.test(name)) {
    throw new Error(`Invalid ICON_NAME: ${name}`);
  }
}

function ensureNameGloballyUnique(indexItems, name, expectedId) {
  const conflict = indexItems.find((item) => item.name === name && item.id !== expectedId);
  if (conflict) {
    throw new Error(`ICON_NAME '${name}' already used by '${conflict.id}'`);
  }
}

function ensureSvgText(svgText) {
  if (!svgText.includes("<svg")) {
    throw new Error("Content is not SVG");
  }
  if (!svgText.includes("viewBox=")) {
    throw new Error("SVG missing viewBox");
  }
}

function ensureSvgSize(svgText) {
  const maxBytes = Number(process.env.MAX_SVG_BYTES || "200000");
  if (Buffer.byteLength(svgText, "utf8") > maxBytes) {
    throw new Error("File too large after download");
  }
}

function decodeBase64Svg(base64Text) {
  let svg = "";
  try {
    svg = Buffer.from(base64Text, "base64").toString("utf8");
  } catch {
    throw new Error("Invalid base64 SVG content");
  }

  ensureSvgSize(svg);
  ensureSvgText(svg);
  return svg;
}

async function fetchSvg(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Download failed with status ${response.status}`);
    }

    const type = response.headers.get("content-type") || "";
    if (!(type.includes("image/svg+xml") || type.includes("text/plain") || type.includes("application/octet-stream"))) {
      throw new Error(`Unsupported content-type: ${type}`);
    }

    const length = Number(response.headers.get("content-length") || "0");
    const maxBytes = Number(process.env.MAX_SVG_BYTES || "200000");
    if (length > 0 && length > maxBytes) {
      throw new Error(`File too large: ${length} bytes`);
    }

    const text = await response.text();
    ensureSvgText(text);
    ensureSvgSize(text);

    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function loadIndex() {
  const indexPath = path.join(process.cwd(), "index.json");
  try {
    const raw = await fs.readFile(indexPath, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return [];
  }

  return [];
}

async function saveIndex(items) {
  const indexPath = path.join(process.cwd(), "index.json");
  await fs.writeFile(indexPath, `${JSON.stringify(items, null, 2)}\n`, "utf8");
}

function upsertIndexItem(items, { repoOwner, repoName, ref, category, name, tags }) {
  const id = `${category}/${name}`;
  const url = `https://cdn.jsdelivr.net/gh/${repoOwner}/${repoName}@${ref}/icons/${name}.svg`;
  const updatedAt = new Date().toISOString();

  const existingIndex = items.findIndex((it) => it.id === id);
  const next = {
    id,
    name,
    category,
    tags,
    url,
    deprecated: false,
    updatedAt
  };

  if (existingIndex >= 0) {
    items[existingIndex] = next;
  } else {
    items.push(next);
  }
}

async function importOne({ sourceUrl, svgContentBase64, category, name, tags, allowedDomains, indexItems, repoOwner, repoName, ref }) {
  ensureCategory(category);
  ensureName(name);
  ensureNameGloballyUnique(indexItems, name, `${category}/${name}`);

  let svg = "";
  if (svgContentBase64) {
    svg = decodeBase64Svg(svgContentBase64);
  } else {
    if (!sourceUrl) {
      throw new Error("source_url or svg_content_base64 is required");
    }
    if (allowedDomains) {
      checkDomainAllowed(sourceUrl, allowedDomains);
    }
    svg = await fetchSvg(sourceUrl, 15000);
  }

  const iconDir = path.join(process.cwd(), "icons");
  await fs.mkdir(iconDir, { recursive: true });

  const targetPath = path.join(iconDir, `${name}.svg`);
  await fs.writeFile(targetPath, svg.trim() + "\n", "utf8");

  upsertIndexItem(indexItems, { repoOwner, repoName, ref, category, name, tags: parseTags(tags) });

  console.log(`Imported icon: ${category}/${name}`);
  console.log(`Saved: icons/${name}.svg`);
}

function parseBatchInput(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("BATCH_JSON is not valid JSON");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("BATCH_JSON must be an array");
  }
  if (parsed.length === 0) {
    throw new Error("BATCH_JSON is empty");
  }
  if (parsed.length > maxBatchCount) {
    throw new Error(`BATCH_JSON exceeds max count ${maxBatchCount}`);
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`BATCH_JSON item at index ${index} must be an object`);
    }

    const sourceUrl = String(item.source_url || "").trim();
    const svgContentBase64 = String(item.svg_content_base64 || "").trim();
    const category = String(item.category || "").trim();
    const name = String(item.name || "").trim();
    const tags = item.tags ?? "";

    if ((!sourceUrl && !svgContentBase64) || !category || !name) {
      throw new Error(`BATCH_JSON item at index ${index} missing source_url|svg_content_base64/category/name`);
    }

    return { sourceUrl, svgContentBase64, category, name, tags };
  });
}

async function main() {
  const repoOwner = readRequiredEnv("REPO_OWNER");
  const repoName = readRequiredEnv("REPO_NAME");
  const ref = process.env.CDN_REF?.trim() || "main";
  const allowedDomains = process.env.ALLOWED_DOMAINS?.trim() || "";
  const batchJsonRaw = readRequiredEnv("BATCH_JSON");
  const indexItems = await loadIndex();

  const items = parseBatchInput(batchJsonRaw);
  console.log(`Batch mode: importing ${items.length} icons`);

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    try {
      await importOne({
        sourceUrl: item.sourceUrl,
        svgContentBase64: item.svgContentBase64,
        category: item.category,
        name: item.name,
        tags: item.tags,
        allowedDomains,
        indexItems,
        repoOwner,
        repoName,
        ref
      });
    } catch (error) {
      throw new Error(`Batch item #${i + 1} failed (${item.category}/${item.name}): ${error.message}`);
    }
  }

  indexItems.sort((a, b) => a.id.localeCompare(b.id));
  await saveIndex(indexItems);
}

await main();
