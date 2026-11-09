# 静态部署 / Static deployment

当前为 Vue + Vite 的纯静态应用，无后端、数据库或服务密钥。本文仅提供部署步骤；没有创建仓库、配置域名或部署站点。任何实际发布需项目所有者另行批准。

## 构建与检查 / Build and inspect

```sh
npm ci
npm test
npm run build
npm run test:smoke
```

使用独立本地预览可运行 `npm run preview`。生产根目录应包含 index.html、assets/、LICENSE、NOTICE.md、SOURCE-CODE.md、THIRD-PARTY-NOTICES.txt 和 source.zip。

## 托管方式 / Hosting choices

| 方式 | 所需配置 |
| --- | --- |
| 通用静态托管 / manual upload | 解压静态 ZIP，将里面的文件作为站点根目录上传 |
| 支持 Node 构建的静态平台 | 构建命令 `npm ci && npm run build`，输出目录 `dist`，Node 24 或 22.x ≥22.12 |
| Nginx / 自有服务器 | 由 Web 服务器提供 dist 内的静态文件，启用 HTTPS；无需运行 Node 生产进程 |

Hash routes such as `/#json` are handled in the browser, so tool navigation does not require per-tool server rewrites. Configure index.html as the root document.

**本版本要求托管在域名根路径 `/`。** 当前资源及许可证/源码链接使用根路径，不宣称直接兼容 `/project-name/` 子目录。GitHub Pages 项目路径未验证；可以在以后另行核验根域名/自定义域名方案，但不要在本轮创建仓库或上线。

## 必须保留的发布条件

- 使用 HTTPS；公开 HTTP 上的剪贴板和 Web Crypto 能力不保证可用。
- Upload the entire dist/ directory, including `/source.zip`, `/LICENSE` and third-party notices. The source must correspond to the served assets and remain as accessible as the application.
- 原子更新：先准备完整新版本，再切换站点根目录；不要混用旧 index.html、新 assets 和旧源码。
- index.html 与 source.zip 建议使用重新验证缓存；带内容哈希的 assets 文件可使用长期 immutable 缓存。
- Serve .js as JavaScript, .css as CSS, .svg as SVG and source.zip as application/zip. Do not rewrite missing .js/.zip requests into index.html.
- No secrets are needed. If the hosting provider injects analytics, access controls, banners or request logging, reassess the public privacy description. Tool inputs must not be added to URLs or logs.

## 上线前与回滚 / Before publication and rollback

确认项目所有者批准、发布状态没有未解决阻断、源码链接可匿名下载、中英文/主题/工具导航可用，并在目标 HTTPS 域名实际验证复制、SHA-256 和随机字符串。目标公网环境目前为 NOT TESTED，因为尚未部署。

保留每次完整静态 ZIP、匹配的源码 ZIP 和 SHA256SUMS.txt。回滚应同时恢复 HTML、assets、许可和源码，不只回滚 HTML。Before deploying, review the release status and its security findings; a successful local build alone is not deployment approval.

## 0.3 扩展资源

新增 PDF Worker 内嵌 QPDF WASM，无外部 API 或 CDN。部署时必须保留整个 assets/（含 Worker 和按需解析器），并使用 HTTPS；Web Crypto 与剪贴板需要安全上下文。若设置 CSP，Worker 需允许 self，WASM 编译需允许 wasm-unsafe-eval；不要误删本地 Worker/解析器资产。本轮只验证 localhost 生产构建，目标托管平台的 CSP、缓存及实际手机仍需上线前检查。

## 本仓库 GitHub Pages

账号/仓库：cfl071023-bit/toolbox-cn。目标地址：https://cfl071023-bit.github.io/toolbox-cn/。Settings → Pages 的来源为 GitHub Actions，工作流是 .github/workflows/pages.yml。构建时设置 TOOLBOX_BASE_PATH=/toolbox-cn/，本地开发默认仍为 /。

现有路由采用 #json、#pdf-merge 等 hash，刷新只请求 /toolbox-cn/，无需伪造 history fallback 或 404 重定向。许可和源码下载也使用相同 base。工作流在严格静态服务上逐项处理 55 个工具后才上传部署产物；不需要自建密钥或第三方托管。上游完整源码与 GPL、版权仍随 source.zip 提供。

部署方法参照 https://vite.dev/guide/static-deploy.html 与 https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages。
