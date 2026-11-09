# 首次公开发布准备状态

版本：0.1.0；日期：2026-11-09；状态：本地候选产物已准备，未创建公开仓库、未部署。公开托管仍需项目所有者批准。

## 实际执行结果

| 检查 | 结果 |
| --- | --- |
| 上游版本与原件 | PASS；固定 d505845f918e946ec300af7b36efc107e2f66e9e，上游目录无本地修改 |
| GPL、署名与同版本源码交付 | PASS（工程核验）；LICENSE/NOTICE/第三方声明及 source.zip 随静态产物提供 |
| 升级后单元测试 | PASS，58/58 |
| 升级后生产浏览器完整回归 | PASS，77/77，无失败、无跳过 |
| 从源 ZIP 干净安装 | PASS，实际 npm ci、58 项单元测试、构建与生产浏览器冒烟 |
| 最终生产构建和独立冒烟 | PASS；最终打包流程另行验证产物完整性 |
| npm 生产依赖审计 | PASS，0 项已知漏洞 |
| npm 全部依赖审计 | PASS，0 项已知漏洞 |
| README 与发布截图 | PASS，8 张真实页面截图，已视觉检查 |
| UI 与工具范围 | 保持既有样式与 30 个工具；只修正英文标题缺失的词间空格 |
| GitHub 仓库与公网部署 | NOT TESTED / 未执行，遵照指示 |
| 实体手机、Safari/Firefox、独立安全审计 | NOT TESTED |

## 本轮变更

完成中英文 README、贡献指南、部署说明、截图清单、工程报告提纲和许可核验。源 ZIP 分发副本中的 QA JSON 脱敏为 <project> 路径；原始证据留存，没有覆盖。许可证文件名识别补充 LICENSE-MIT 等形式，并保留依赖 README 中的原许可及补充原件。移除没有直接用途的 TypeScript 开发依赖，测试输出归入 test-results，归档排除缓存、Git、node_modules 和本机状态。

初次 npm 生产审计发现 7 项已知漏洞。已将 Vue、colord、diff、uuid、lodash-es、yaml 升级至兼容修复版本；开发审计另发现构建/测试工具问题，Vite 升至 6.4.5、Vitest 升至 5.1.0。后者仅影响测试设施，58 项测试实际通过。最终两个 npm 审计均为 0；这不是“绝对安全”的保证。安装曾因自动审批服务连接中断未执行，服务恢复后已完成，当前无该阻断。

精确锁定版本见 package-lock.json，版本摘要见 RELEASE-VALIDATION.json。测试证据见 qa-evidence/release-production.json；原首轮报告与证据保持原样。

## 发布包与剩余条件

release/ 包含源码 ZIP、静态 ZIP、RELEASE-MANIFEST.json、PACKAGE-SCAN.json 和 SHA256SUMS.txt。实际归档扫描与校验结果以这些文件为准，不用本文代替机器检查。两个包没有 node_modules、Git 或临时日志；源码中保留 498 个上游原文件。

目前没有已知阻断本地交付的功能或依赖漏洞。待所有者批准后，还需在目标 HTTPS 域名检查源 ZIP 匿名访问、复制、Web Crypto、缓存与回滚。当前仅支持域名根路径部署；子路径部署未验证。

非阻断提示：构建时 sax 的 Node stream 被 Vite 外部化，生产 XML 实际处理已通过。lucide-vue-next 安装有弃用提示，当前图标和 UI 回归通过；本轮不迁移图标系统。

## 截图

8 张 PNG 均在 docs/screenshots/，用途与尺寸见 SCREENSHOTS.zh-CN.md。中文/英文首页、深色、移动版、搜索、JSON、压缩和二维码均来自真实运行页面，不含私人用户数据或虚构指标。
