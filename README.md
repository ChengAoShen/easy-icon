# Easy Icon

![Private & Controllable](https://img.shields.io/badge/Private-Controllable-1f6f5f)
![Stable Links](https://img.shields.io/badge/Stable-CDN%20Links-0f766e)
![GitHub Native](https://img.shields.io/badge/GitHub-Native-24292f?logo=github&logoColor=white)
![Web Frontend](https://img.shields.io/badge/Web-Frontend-2563eb)

[中文](./README.zh-CN.md)

---

## ✨ What Is Easy Icon

Easy Icon is a fully GitHub-based icon hosting and delivery solution.  
You can manage icon assets in your own repository and get stable, shareable links through GitHub Pages, without extra servers or object storage.

---

## 🚀 Core Capabilities

- **Private and controllable**: Icon assets stay in your own GitHub repository.
- **Stable links**: Provides long-term, versionable CDN URLs.
- **Simple deployment**: Uses GitHub end-to-end (Repo + Actions + Pages), ready out of the box.

---

## 🧭 Quick Start

### 1) Deploy the Site

1. **Fork** this repository to your GitHub account or organization.
2. Go to `Settings -> Pages`, then set `Build and deployment -> Source` to `GitHub Actions`.
3. Go to `Settings -> Actions -> General`, then set `Workflow permissions` to `Read and write permissions`.
4. Open the `Actions` tab and run the `Deploy Pages` workflow.

After setup, your site URL is usually:

- `https://<user-or-org>.github.io/<repo>/`

### 2) Upload Images

1. Generate a batch upload config (JSON) from a URL list or local SVG files.
2. Run the corresponding upload workflow in GitHub `Actions` to complete the commit.

### 3) Use Images

1. Open the web homepage.
2. Click and copy the link directly.

---

## ❓ FAQ

- **`Get Pages site failed` / `Resource not accessible by integration`**
  - This usually means Pages is not enabled, or workflow write permission is not enabled.
  - Recheck steps 2 and 3 under “Quick Start -> Deploy the Site”.
- **The URL is not `github.io`**
  - If your account or organization uses a custom domain, the final URL will be that domain.

---

## 📮 Contact

- Email: `contact@catvinci.com`
