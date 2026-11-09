# 对应源码 / Corresponding source

ToolBox CN 是 GPL-3.0-only 衍生作品。上游为 CorentinTh/it-tools，提交 d505845f918e946ec300af7b36efc107e2f66e9e。保留上游作者、免责声明和许可；ToolBox CN 改动列于 NOTICE.md 与 REUSE.md。

每次 `npm run build` 会先生成 `public/source.zip`，再将其复制进 `dist/source.zip`。此 ZIP 包含当前应用的可修改源文件、固定上游源码、构建与安装脚本、package-lock.json、测试、文档及法律文件；不包含 node_modules、Git 元数据、临时输出或压缩后的 dist。可用 `npm ci` 安装锁定依赖，再构建。

The existing Open source & license dialog links to `/source.zip` and `/LICENSE`. Keep these files publicly accessible next to the exact static build they accompany. Upload the entire dist directory atomically, and replace the matching source archive whenever the application changes. The offered source must match the served JavaScript, not a different revision.

原始 QA 证据在开发工作区保留。源码分发副本仅对 QA JSON 中的本机路径进行替换，使用 `<project>` 表示项目根目录；测试结果、状态、输入夹具和指标不因脱敏而改变。上游源码与版权声明不会被脱敏处理。

GPL 网络分发要求参考 [GPLv3 第 4、5、6 节](https://www.gnu.org/licenses/gpl-3.0.html) 与 [GNU 对同版本对应源码的说明](https://www.gnu.org/licenses/gpl-faq.html.en#AnonFTPAndSendSources)。本项目采用同站点直接提供源码的方式，不依赖未来创建 GitHub 仓库的承诺来代替源码交付。

本轮扩展另外保留 sharevb/it-tools `b5eace85dbdb247f832b2aa9967b9d570a84d1ce` 的完整原始源码与许可证于 upstream-sharevb/，构建 ZIP 已包含该目录。GPL 和第三方原版权须随分发保留；当前开发构建的对应源码不能替换为旧版发布归档。

This expansion also includes the pinned sharevb source tree and license in upstream-sharevb/. Preserve both upstream trees and notices when distributing source. Pair each static build with its own regenerated source.zip.

公开分发范围：保留两个上游的源码模块、构建配置、GPL 与原版权。sharevb/public 中未使用的预编译第三方资源不随本产品重新分发，humans.txt 署名保留；原始完整快照和旧 QA/发布归档仍保存在维护者工作区。精确清单见 docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json。55 项实际工具及构建所需资源完整保留。历史 QA 中 2624 文件逐字节核验针对原工作区快照，不代表公开包包含未使用的二进制资源。

Public distribution retains upstream source modules, build configuration, GPL and original notices. Unused precompiled third-party assets under sharevb/public are omitted (humans.txt retained); see docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json. All 55 tool sources and required runtime assets remain included. The untouched full snapshot and frozen release archives remain in the original workspace.
