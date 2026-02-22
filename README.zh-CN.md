# Easy Icon（中文）

![私有可控](https://img.shields.io/badge/Private-Controllable-1f6f5f)
![稳定链接](https://img.shields.io/badge/Stable-CDN%20Links-0f766e)
![全程 GitHub](https://img.shields.io/badge/GitHub-Native-24292f?logo=github&logoColor=white)
![网页前端](https://img.shields.io/badge/Web-Frontend-2563eb)

[English](./README.md)

---

## ✨ Easy Icon 是什么

Easy Icon 是一套完全基于 GitHub 的图标托管与分发方案。
你可以在自己的仓库中管理图标资产，并通过 GitHub Pages 获得稳定、可分享的访问链接，无需额外服务器或对象存储。

---

## 🚀 核心能力

- **私有可控**：图标资产保存在你的 GitHub 仓库中。
- **链接稳定**：提供长期可用、可版本化的 CDN 链接。
- **部署简单**：全流程使用 GitHub（仓库 + Actions + Pages），开箱即用。

---

## 🧭 快速开始

### 1) 部署站点

1. 将本仓库 **Fork** 到你的 GitHub 账号或组织。
2. 进入 `Settings -> Pages`，在 `Build and deployment -> Source` 中选择 `GitHub Actions`。
3. 进入 `Settings -> Actions -> General`，将 `Workflow permissions` 设为 `Read and write permissions`。
4. 打开 `Actions` 页面，运行 `Deploy Pages` 工作流。

完成后，站点地址通常为：

- `https://<用户名或组织>.github.io/<仓库名>/`

### 2) 上传图片

1. 通过 URL 列表或本地 SVG 生成批量上传配置（JSON）。
2. 在 GitHub `Actions` 中运行对应上传工作流，完成提交。

### 3) 使用图片

1. 进入网页端首页
2. 直接点击复制连接即可

---

## ❓ 常见问题

- **`Get Pages site failed` / `Resource not accessible by integration`**
  - 通常是 Pages 未启用，或 Workflow 写权限未开启。
  - 请按“快速开始 -> 部署站点”中的第 2、3 步再次检查。
- **访问地址不是 `github.io`**
  - 如果账号或组织配置了自定义域名，最终地址会显示为自定义域名。


---

## 📮 联系方式

- Email: `contact@catvinci.com`
