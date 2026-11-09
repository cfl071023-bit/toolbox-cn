# 许可与上游核验

日期：2026-11-09。此文记录工程核验与分发措施，不是对所有司法辖区作出的法律认证。

## 精确来源

- 仓库：https://github.com/CorentinTh/it-tools 。本项目不是基于 sharevb 分支构建。
- 固定提交：`d505845f918e946ec300af7b36efc107e2f66e9e`。
- 提交时间：2026-02-12 01:59:29 +0100；标题：chore(readme): remove sponsors section (#1733)。
- 上游 package.json 的版本字段：`2024.10.22-7ca5933`。这是上游保留的标签，不是本次实际提交 ID。
- 核验方法：读取本地上游 Git remote、rev-parse HEAD、提交记录与 status；上游目录无本地修改。不是根据目录名猜测版本。
- 原始上游有 498 个跟踪文件，发布源码保留原文件及版权声明，不分发 .git 元数据。

## GPL 与版权保留

上游 README 和 package.json 声明 GNU GPLv3，附完整 GPL 第 3 版文本。ToolBox CN 以 GPL-3.0-only 标注自身分发，不把同捆第三方代码改成自有许可。

根目录 LICENSE 与 upstream/LICENSE 的 SHA-256 均为：

`81cbae84a29ce7e770bf2bc7b178e50bda0ce8de6067aba661b0bc7b05b562f8`

保留 IT-Tools 作者 Corentin Thomasset 与贡献者署名、原始源码和原许可；NOTICE.md 列出 ToolBox CN 的改动日期与范围，REUSE.md 逐项说明原样复制和适配来源。五个直接复用模块保持与固定上游文件相同，不向原件强加新的版权声明。

依照 [GPLv3 第 4、5、6 节](https://www.gnu.org/licenses/gpl-3.0.html)，分发时应保留许可、版权及无担保声明，明确改动，并为编译/压缩后的产物提供对应源码。本项目通过界面的既有许可入口及同站 `/source.zip`、`/LICENSE` 提供访问；源码随每次构建生成。这个实现采用同站点直接交付源码的方式，不仅是承诺以后开源。相关解释见 [GNU 同版本源码要求](https://www.gnu.org/licenses/gpl-faq.html.en#AnonFTPAndSendSources)。

## 对应源码内容

源码 ZIP 包含当前可修改应用、保留上游、依赖锁文件、安装/构建/测试/打包脚本、测试夹具、文档与许可证。原始 QA 证据仍保留在工作区；公开副本仅脱敏个人路径，未改变测试结果。排除 node_modules、Git、dist、测试运行缓存、日志、临时文件及环境文件。

包内 upstream/LICENSE 和根 LICENSE 保持原文，原上游文件按字节校验。将完整 dist 部署到根路径并保持源 ZIP 可匿名下载，是实际托管时仍需执行的步骤；本轮尚未部署，因此公网可访问性为 NOT TESTED。

## 第三方与图片

- 构建从实际安装依赖生成 public/THIRD-PARTY-NOTICES.txt 和 docs/DEPENDENCY-LICENSES.json，包含作者、仓库、原许可及 NOTICE。许可文件名识别覆盖 LICENSE-MIT 等变体。
- 部分 npm 包没有独立 LICENSE 文件：保留发布的 README 内原许可；同一上游 monorepo 的许可副本放在 docs/licenses/，不虚构版权年份。
- netmask 的完整 MIT 许可和 Olivier Poitrey 署名在发布 README 中，已纳入声明；upper-case 使用 change-case 上游的 MIT 许可和 Blake Embrey 署名。
- railroad-diagrams 原文声明 CC0 并署名 Tab Atkins Jr.，保留其 README/原始声明。
- README 的真实压缩截图使用已有 Grace Hopper 公共测试照片，来源记录见 tests/fixtures/README.md；其他截图为本项目真实界面，无用户密码、令牌或个人照片。

## 部署责任

必须把静态 ZIP 内的源码、许可和声明与同版 assets 一起上传；不能只上传 index.html 与 JavaScript。修改代码后应重新构建，不混用旧源 ZIP。当前静态架构、公开根路径与 HTTPS 要求见 DEPLOYMENT.md。

公开 GitHub 仓库、域名、托管站点均未创建。没有以“GPL 核验通过”代替项目所有者的上线授权。
