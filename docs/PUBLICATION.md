# GitHub 首次公开发布（2026-11-09）

- 公开仓库：https://github.com/cfl071023-bit/toolbox-cn
- 网站：https://cfl071023-bit.github.io/toolbox-cn/
- 账号经 GitHub API 实际核验为 cfl071023-bit，提交使用其 GitHub noreply 地址。
- 首次成功构建/部署：https://github.com/cfl071023-bit/toolbox-cn/actions/runs/42632491177

## 已执行检查

- PASS：独立发布副本 npm ci、116 项单元测试、生产构建。
- PASS：GitHub Actions 在 Ubuntu 24.04 上重新安装、测试、构建并部署。
- PASS：本机严格静态 /toolbox-cn/ 路径下实际处理全部 55 项工具。
- PASS：直接在公开 HTTPS 网站的 Chromium 浏览器实际处理全部 55 项工具，包含 PDF 下载/页数、图片输出、二维码识别、hash 路由刷新、许可/源码链接、语言/主题、收藏刷新和手机视口。
- PASS：GitHub 将仓库识别为公开、GPL-3.0；Pages 已启用 HTTPS。

首次工作流因 ubuntu-latest 升级为 Ubuntu 26.04，导致 Playwright 1.56.1 无法安装；已固定 ubuntu-24.04，后续构建/部署通过。未通过的历史运行保留，不将其记为成功。

## 发布内容和许可

原工作区项目根目录没有 Git 仓库，发布使用独立副本；未上传本机 Git 元数据、node_modules、dist、原始 test-results、私密环境文件或旧版本地 release ZIP。原项目和 QA/冻结发布证据完整保留；公开 QA 副本已清除本机绝对路径。

扫描及人工核查未发现真实访问令牌或私人路径。上游公开加密测试样例中的私钥不是账户凭据，按固定源码原样保留，并在 PUBLICATION-SCAN.json 记录 SHA-256。合法的原作者署名及公开贡献者信息没有删除。

应用仍为 GPL-3.0-only，保留原版权、LICENSE、NOTICE、REUSE 和第三方许可，并提供与静态构建同时生成的 source.zip。未使用的上游预编译资源未重新分发；精确清单见 SOURCE-DISTRIBUTION-EXCLUSIONS.json。完整的本产品源码及构建/测试资源均已上传。

## 后续部署

向 main 推送会触发 .github/workflows/pages.yml。只有依赖安装、单元测试、生产构建与 55 工具路径检查通过后，才部署 GitHub Pages。构建使用 TOOLBOX_BASE_PATH=/toolbox-cn/；本地开发默认仍为 /。采用 hash 路由，刷新无需 history fallback。

实体手机、Firefox/Safari 和独立安全审计仍为 NOT TESTED；不因首次上线成功而扩大测试结论。
