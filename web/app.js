const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const iconGrid = document.getElementById("iconGrid");
const resultMeta = document.getElementById("resultMeta");
const toast = document.getElementById("toast");
const template = document.getElementById("iconCardTemplate");
const galleryView = document.getElementById("galleryView");
const batchView = document.getElementById("batchView");
const viewTabs = document.querySelectorAll(".view-tab");
const langZhBtn = document.getElementById("langZhBtn");
const langEnBtn = document.getElementById("langEnBtn");
const batchCategoryList = document.getElementById("batchCategoryList");
const batchRowBody = document.getElementById("batchRowBody");
const addRowBtn = document.getElementById("addRowBtn");
const generateBatchBtn = document.getElementById("generateBatchBtn");
const copyBatchBtn = document.getElementById("copyBatchBtn");
const batchMeta = document.getElementById("batchMeta");
const batchPreviewBody = document.getElementById("batchPreviewBody");
const batchJsonOutput = document.getElementById("batchJsonOutput");
const batchRowTemplate = document.getElementById("batchRowTemplate");

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const categoryPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const langStorageKey = "easy-icon-lang";
const maxLocalSvgBytes = 200000;

const messages = {
  zh: {
    heroTitle: "My Icon Link Gallery",
    heroSub: "搜索、按分类过滤，点击卡片即可复制最新链接。",
    tabGallery: "Icon 展览",
    tabBatch: "Batch 生成器",
    searchLabel: "关键词搜索",
    searchPlaceholder: "名称 / 标签 / ID",
    categoryFilterLabel: "分类筛选",
    allCategories: "全部分类",
    batchTitle: "批量导入配置器",
    batchSub: "每行填写一个来源（URL 或本地 SVG）、分类和 tags，最后生成 batch_json。",
    rowSource: "SVG / URL",
    rowCategory: "分类",
    rowTags: "Tags",
    rowName: "名称（可选）",
    rowAction: "操作",
    addRowBtn: "新增一行",
    rowUrlPlaceholder: "https://example.com/icon.svg",
    rowCategoryPlaceholder: "navigation",
    rowTagsPlaceholder: "arrow,left,back",
    rowNamePlaceholder: "custom-name（可选）",
    removeRowBtn: "移除",
    generateJsonBtn: "生成 JSON",
    copyBatchBtn: "复制 batch_json",
    batchMetaIdle: "等待输入...",
    batchResultLabel: "生成结果（粘贴到 Import Icon 的 batch_json）",
    colName: "name",
    colSourceUrl: "source_url",
    emptyResult: "暂无匹配图标。你可以先通过 Import Icon 工作流导入 SVG。",
    copied: "链接已复制",
    copyFailed: "复制失败，请手动复制",
    categoryRequired: "第 {index} 行 category 不能为空，且需为 kebab-case。",
    inputSourceFirst: "请至少填写一行有效数据（URL 或本地 SVG）。",
    invalidUrl: "URL 无效",
    invalidName: "自动生成的 name 不符合 kebab-case",
    localSvgInvalid: "本地文件不是有效 SVG",
    localSvgTooLarge: "本地文件过大（>{bytes} bytes）",
    localSvgReadFailed: "本地文件读取失败：{name}",
    duplicateName: "重复 name: {id}",
    duplicateUrl: "重复 URL",
    rowError: "第 {index} 行：{error}",
    rowSourceConflict: "URL 与本地文件不能同时填写",
    localFileError: "文件 {name}：{error}",
    errorCount: "发现 {count} 个错误：{details}",
    generatedCount: "已生成 {count} 条记录。可复制到 Import Icon 的 batch_json 输入。",
    autoRenamed: "有 {count} 行名称重复，已自动改为 name1/name2...",
    noJsonToCopy: "没有可复制的 JSON",
    batchCopied: "batch_json 已复制",
    loadFailed: "加载失败：{message}",
    resultMeta: "共 {count} 个结果（总计 {total} 个图标）",
    rowRemoved: "已移除该行"
  },
  en: {
    heroTitle: "My Icon Link Gallery",
    heroSub: "Search, filter by category, and click cards to copy the latest link.",
    tabGallery: "Icon Gallery",
    tabBatch: "Batch Builder",
    searchLabel: "Keyword Search",
    searchPlaceholder: "Name / tags / ID",
    categoryFilterLabel: "Category Filter",
    allCategories: "All categories",
    batchTitle: "Batch Import Builder",
    batchSub: "Each row contains one source (URL or local SVG), category, and tags. Then generate batch_json.",
    rowSource: "SVG / URL",
    rowCategory: "Category",
    rowTags: "Tags",
    rowName: "Name (optional)",
    rowAction: "Action",
    addRowBtn: "Add Row",
    rowUrlPlaceholder: "https://example.com/icon.svg",
    rowCategoryPlaceholder: "navigation",
    rowTagsPlaceholder: "arrow,left,back",
    rowNamePlaceholder: "custom-name (optional)",
    removeRowBtn: "Remove",
    generateJsonBtn: "Generate JSON",
    copyBatchBtn: "Copy batch_json",
    batchMetaIdle: "Waiting for input...",
    batchResultLabel: "Generated output (paste into Import Icon -> batch_json)",
    colName: "name",
    colSourceUrl: "source_url",
    emptyResult: "No matching icons. Import SVGs first via the Import Icon workflow.",
    copied: "Link copied",
    copyFailed: "Copy failed, please copy manually",
    categoryRequired: "Line {index} category is required and must be kebab-case.",
    inputSourceFirst: "Please provide at least one valid row (URL or local SVG).",
    invalidUrl: "Invalid URL",
    invalidName: "Auto-generated name must be kebab-case",
    localSvgInvalid: "Local file is not a valid SVG",
    localSvgTooLarge: "Local file is too large (>{bytes} bytes)",
    localSvgReadFailed: "Failed to read local file: {name}",
    duplicateName: "Duplicate name: {id}",
    duplicateUrl: "Duplicate URL",
    rowError: "Line {index}: {error}",
    rowSourceConflict: "URL and local file cannot both be set",
    localFileError: "File {name}: {error}",
    errorCount: "Found {count} errors: {details}",
    generatedCount: "Generated {count} records. You can paste this into Import Icon batch_json.",
    autoRenamed: "{count} rows had duplicate names and were auto-renamed to name1/name2...",
    noJsonToCopy: "No JSON to copy",
    batchCopied: "batch_json copied",
    loadFailed: "Load failed: {message}",
    resultMeta: "{count} results (total {total} icons)",
    rowRemoved: "Row removed"
  }
};

let icons = [];
let toastTimer = null;
let currentLang = "zh";
let rowSeed = 0;

function normalize(text) {
  return String(text || "").trim().toLowerCase();
}

function t(key, vars = {}) {
  const template = messages[currentLang][key] || messages.zh[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
}

function detectInitialLang() {
  const saved = localStorage.getItem(langStorageKey);
  if (saved === "zh" || saved === "en") {
    return saved;
  }
  const browserLang = (navigator.language || "").toLowerCase();
  return browserLang.startsWith("zh") ? "zh" : "en";
}

function applyI18n() {
  const textNodes = document.querySelectorAll("[data-i18n]");
  textNodes.forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  const placeholders = document.querySelectorAll("[data-i18n-placeholder]");
  placeholders.forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  langZhBtn.classList.toggle("is-active", currentLang === "zh");
  langEnBtn.classList.toggle("is-active", currentLang === "en");
}

function refreshBatchRowsI18n() {
  const rows = batchRowBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const urlInput = row.querySelector(".row-url");
    const categoryInput = row.querySelector(".row-category");
    const tagsInput = row.querySelector(".row-tags");
    const nameInput = row.querySelector(".row-name");
    const removeBtn = row.querySelector(".row-remove");

    urlInput.placeholder = t("rowUrlPlaceholder");
    categoryInput.placeholder = t("rowCategoryPlaceholder");
    tagsInput.placeholder = t("rowTagsPlaceholder");
    nameInput.placeholder = t("rowNamePlaceholder");
    removeBtn.textContent = t("removeRowBtn");
  });
}

function setLanguage(lang) {
  if (!(lang === "zh" || lang === "en")) return;
  currentLang = lang;
  localStorage.setItem(langStorageKey, lang);
  applyI18n();
  refreshBatchRowsI18n();
  filterIcons();
  if (!batchJsonOutput.value.trim()) {
    batchMeta.textContent = t("batchMetaIdle");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
}

function createTags(icon) {
  const tags = [];
  tags.push(icon.category);
  if (Array.isArray(icon.tags)) {
    tags.push(...icon.tags.slice(0, 3));
  }
  return tags;
}

function sanitizeFromFilename(input) {
  return normalize(input)
    .replace(/\.svg$/i, "")
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function deriveNameFromUrl(sourceUrl) {
  const url = new URL(sourceUrl);
  const parts = url.pathname.split("/").filter(Boolean);
  const last = parts.at(-1);
  if (!last) {
    return "";
  }
  return sanitizeFromFilename(decodeURIComponent(last));
}

function encodeBase64Utf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

function isValidSvgText(text) {
  return text.includes("<svg") && text.includes("viewBox=");
}

function createBatchRow() {
  const node = batchRowTemplate.content.cloneNode(true);
  const row = node.querySelector("tr");
  const rowId = `r${Date.now()}_${rowSeed++}`;
  row.dataset.rowId = rowId;

  node.querySelector(".row-url").placeholder = t("rowUrlPlaceholder");
  node.querySelector(".row-category").placeholder = t("rowCategoryPlaceholder");
  node.querySelector(".row-tags").placeholder = t("rowTagsPlaceholder");
  node.querySelector(".row-name").placeholder = t("rowNamePlaceholder");

  const removeBtn = node.querySelector(".row-remove");
  removeBtn.textContent = t("removeRowBtn");
  removeBtn.addEventListener("click", () => {
    row.remove();
    showToast(t("rowRemoved"));
  });

  batchRowBody.appendChild(node);
}

async function readSvgFile(file) {
  if (file.size > maxLocalSvgBytes) {
    throw new Error(t("localSvgTooLarge", { bytes: maxLocalSvgBytes }));
  }

  const text = await file.text();
  if (!isValidSvgText(text)) {
    throw new Error(t("localSvgInvalid"));
  }

  return text.trim();
}

function allocateUniqueName(baseName, usedNames) {
  if (!usedNames.has(baseName)) {
    usedNames.add(baseName);
    return { name: baseName, renamed: false };
  }

  let i = 1;
  while (usedNames.has(`${baseName}${i}`)) {
    i += 1;
  }
  const finalName = `${baseName}${i}`;
  usedNames.add(finalName);
  return { name: finalName, renamed: true };
}

function renderBatchPreview(rows) {
  batchPreviewBody.innerHTML = "";
  const fragment = document.createDocumentFragment();
  rows.forEach((row, index) => {
    const tr = document.createElement("tr");
    if (!row.ok) {
      tr.className = "is-error";
    }

    const indexCell = document.createElement("td");
    indexCell.textContent = String(index + 1);

    const nameCell = document.createElement("td");
    nameCell.textContent = row.name || "-";

    const urlCell = document.createElement("td");
    urlCell.textContent = row.url;

    tr.append(indexCell, nameCell, urlCell);
    fragment.appendChild(tr);
  });

  batchPreviewBody.appendChild(fragment);
}

async function buildBatchJson() {
  const rows = Array.from(batchRowBody.querySelectorAll("tr"));
  if (rows.length === 0) {
    batchMeta.textContent = t("inputSourceFirst");
    batchJsonOutput.value = "";
    renderBatchPreview([]);
    return;
  }

  const entries = [];
  const rowStates = [];
  const errors = [];
  let autoRenamedCount = 0;
  const idSet = new Set();
  const urlSet = new Set();
  const usedNames = new Set(icons.map((icon) => normalize(icon.name)).filter(Boolean));

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const urlInput = row.querySelector(".row-url");
    const fileInput = row.querySelector(".row-file");
    const categoryInput = row.querySelector(".row-category");
    const tagsInput = row.querySelector(".row-tags");
    const nameInput = row.querySelector(".row-name");

    const rawUrl = urlInput.value.trim();
    const file = fileInput.files?.[0];
    const category = normalize(categoryInput.value);
    const customName = normalize(nameInput.value);
    const tags = String(tagsInput.value || "")
      .split(",")
      .map((tag) => normalize(tag))
      .filter(Boolean);

    if (!rawUrl && !file) {
      continue;
    }

    if (rawUrl && file) {
      errors.push(t("rowError", { index: i + 1, error: t("rowSourceConflict") }));
      rowStates.push({ ok: false, name: "-", url: rawUrl || `local:${file.name}` });
      continue;
    }

    if (!categoryPattern.test(category)) {
      errors.push(t("categoryRequired", { index: i + 1 }));
      rowStates.push({ ok: false, name: "-", url: rawUrl || `local:${file?.name || ""}` });
      continue;
    }

    let name = "";
    let sourceUrl = "";
    let svgContentBase64 = "";
    let sourceLabel = "";

    if (rawUrl) {
      try {
        const parsedUrl = new URL(rawUrl);
        if (!(parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:")) {
          throw new Error();
        }
        sourceUrl = parsedUrl.toString();
      } catch {
        errors.push(t("rowError", { index: i + 1, error: t("invalidUrl") }));
        rowStates.push({ ok: false, name: "-", url: rawUrl });
        continue;
      }
      name = customName || deriveNameFromUrl(sourceUrl);
      sourceLabel = sourceUrl;
    } else {
      name = customName || sanitizeFromFilename(file.name);
      sourceLabel = `local:${file.name}`;
      try {
        const svgText = await readSvgFile(file);
        svgContentBase64 = encodeBase64Utf8(svgText);
      } catch (error) {
        errors.push(t("localFileError", { name: file.name, error: error.message }));
        rowStates.push({ ok: false, name, url: sourceLabel });
        continue;
      }
    }

    if (!namePattern.test(name)) {
      errors.push(t("rowError", { index: i + 1, error: t("invalidName") }));
      rowStates.push({ ok: false, name, url: sourceLabel });
      continue;
    }

    const unique = allocateUniqueName(name, usedNames);
    name = unique.name;
    if (unique.renamed) {
      autoRenamedCount += 1;
    }

    const id = `${category}/${name}`;
    if (idSet.has(id)) {
      errors.push(t("rowError", { index: i + 1, error: t("duplicateName", { id }) }));
      rowStates.push({ ok: false, name, url: sourceLabel });
      continue;
    }

    if (sourceUrl && urlSet.has(sourceUrl)) {
      errors.push(t("rowError", { index: i + 1, error: t("duplicateUrl") }));
      rowStates.push({ ok: false, name, url: sourceLabel });
      continue;
    }

    idSet.add(id);
    if (sourceUrl) {
      urlSet.add(sourceUrl);
      entries.push({ source_url: sourceUrl, category, name, tags });
    } else {
      entries.push({ svg_content_base64: svgContentBase64, category, name, tags });
    }

    rowStates.push({ ok: true, name, url: sourceLabel });
  }

  renderBatchPreview(rowStates);

  if (entries.length === 0) {
    batchMeta.textContent = t("inputSourceFirst");
    batchJsonOutput.value = "";
    return;
  }

  if (errors.length > 0) {
    batchMeta.textContent = t("errorCount", { count: errors.length, details: errors.slice(0, 3).join("; ") });
    batchJsonOutput.value = "";
    return;
  }

  batchJsonOutput.value = JSON.stringify(entries, null, 2);
  batchMeta.textContent = t("generatedCount", { count: entries.length });
  if (autoRenamedCount > 0) {
    showToast(t("autoRenamed", { count: autoRenamedCount }));
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

function render(list) {
  iconGrid.innerHTML = "";

  if (list.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = t("emptyResult");
    iconGrid.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  list.forEach((icon, i) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector(".icon-card");
    const preview = node.querySelector(".icon-preview");
    const iconName = node.querySelector(".icon-name");
    const iconId = node.querySelector(".icon-id");
    const chipRow = node.querySelector(".chip-row");
    const copyBtn = node.querySelector(".copy-btn");

    card.style.animationDelay = `${Math.min(i * 18, 180)}ms`;
    preview.src = icon.url;
    preview.alt = icon.id;
    iconName.textContent = icon.name;
    iconId.textContent = icon.id;

    const tags = createTags(icon);
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = tag;
      chipRow.appendChild(chip);
    });

    const targetLink = icon.url;
    copyBtn.addEventListener("click", async () => {
      const ok = await copyText(targetLink);
      showToast(ok ? t("copied") : t("copyFailed"));
    });

    card.addEventListener("click", async (event) => {
      if (event.target.closest("button")) return;
      const ok = await copyText(targetLink);
      showToast(ok ? t("copied") : t("copyFailed"));
    });

    fragment.appendChild(node);
  });

  iconGrid.appendChild(fragment);
}

function filterIcons() {
  const keyword = normalize(searchInput.value);
  const category = categorySelect.value;

  const list = icons.filter((icon) => {
    if (icon.deprecated) return false;
    if (category !== "all" && icon.category !== category) return false;

    if (!keyword) return true;

    const haystack = [icon.id, icon.name, icon.category, ...(icon.tags || [])]
      .map((s) => normalize(s))
      .join(" ");
    return haystack.includes(keyword);
  });

  resultMeta.textContent = t("resultMeta", { count: list.length, total: icons.length });
  render(list);
}

function setupCategories() {
  const allOption = categorySelect.querySelector("option[value='all']");
  if (allOption) {
    allOption.textContent = t("allCategories");
  }

  categorySelect.querySelectorAll("option:not([value='all'])").forEach((node) => node.remove());

  const categories = Array.from(new Set(icons.map((icon) => icon.category))).sort((a, b) =>
    a.localeCompare(b)
  );

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function setupBatchCategories() {
  const categories = Array.from(new Set(icons.map((icon) => normalize(icon.category)).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b)
  );

  batchCategoryList.innerHTML = "";
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    batchCategoryList.appendChild(option);
  });
}

function switchView(view) {
  const isGallery = view === "gallery";
  galleryView.classList.toggle("is-active", isGallery);
  batchView.classList.toggle("is-active", !isGallery);
  viewTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
}

async function loadData() {
  try {
    const response = await fetch("./index.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Load failed: ${response.status}`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("index.json is not an array");
    }
    icons = data;
  } catch (error) {
    icons = [];
    resultMeta.textContent = t("loadFailed", { message: error.message });
  }

  setupCategories();
  setupBatchCategories();
  filterIcons();
}

searchInput.addEventListener("input", filterIcons);
categorySelect.addEventListener("change", filterIcons);
viewTabs.forEach((button) => {
  button.addEventListener("click", () => {
    switchView(button.dataset.view);
  });
});
langZhBtn.addEventListener("click", () => setLanguage("zh"));
langEnBtn.addEventListener("click", () => setLanguage("en"));
addRowBtn.addEventListener("click", createBatchRow);
generateBatchBtn.addEventListener("click", () => {
  void buildBatchJson();
});
copyBatchBtn.addEventListener("click", async () => {
  if (!batchJsonOutput.value.trim()) {
    showToast(t("noJsonToCopy"));
    return;
  }
  const ok = await copyText(batchJsonOutput.value);
  showToast(ok ? t("batchCopied") : t("copyFailed"));
});

switchView("gallery");
currentLang = detectInitialLang();
applyI18n();
createBatchRow();
loadData();
