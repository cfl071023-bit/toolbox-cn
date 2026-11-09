# 上游复用与改动记录

基础：CorentinTh/it-tools，固定版本 `d505845f918e946ec300af7b36efc107e2f66e9e`。原始代码保留在 `upstream/`，未改动。IT-Tools © Corentin Thomasset 与贡献者，GPLv3。

| ToolBox CN 实现 | 复用来源及说明 |
| --- | --- |
| `src/vendor/base64.ts` | 原样复制 `upstream/src/utils/base64.ts` |
| `src/vendor/integer-base.ts` | 原样复制 `integer-base-converter/integer-base-converter.model.ts`，外层补充正负数、进制及空值校验 |
| `src/vendor/temperature.ts` | 原样复制 `temperature-converter/temperature-converter.models.ts`，外层限制物理温度范围 |
| `src/vendor/roman.ts` | 原样复制 `roman-numeral-converter/roman-numeral-converter.service.ts`，外层修正空值与整数范围校验 |
| `src/vendor/text-statistics.ts` | 原样复制 `text-statistics/text-statistics.service.ts`，额外增加中文字符与浏览器中文分词统计 |
| 英文大小写、命名转换 | 沿用上游 `change-case` 库及原生大小写操作 |
| HTML 实体转义 | 沿用上游 lodash 的 escape / unescape，通过等价的 ESM 发行包导入 |
| JSON / YAML | 沿用上游 YAML 库，补充解析错误及 alias 展开上限 |
| XML 排版 | 沿用上游 xml-formatter；使用上游 xml-js 的严格解析器预先校验，修复标签不匹配仍被格式化的问题 |
| SQL 排版 | 沿用上游 sql-formatter，选择可用 SQL 方言，只输出文本 |
| Markdown 转 HTML | 沿用上游 marked 库，只展示源码，不执行输入 HTML |
| IPv4 子网 | 沿用上游 netmask 库，严格校验 IPv4/CIDR 文本，不扫描网络 |
| JWT 解码 | 沿用上游 jwt-decode 库，明确标注不验证签名或真实性 |
| Wi-Fi 二维码 | 从上游 `wifi-qr-code-generator/useQRCode.ts` 适配 SSID / 密码转义和 WPA、WEP、开放网络格式，沿用 qrcode 生成库 |
| SVG 占位图 | 适配上游 `svg-placeholder-generator.vue` 的 SVG 模板，增加尺寸范围、色值校验及文字转义 |
| URL 解析 / 编解码 | 沿用上游的浏览器 URL、encodeURIComponent / decodeURIComponent 方式 |
| 文本清单去重 | 适配上游 list-converter 的清理、去重、保序与排序行为 |
| JSON / CSV | 采用 Papa Parse 实现标准引号、换行和字段合并，避免直接搬入上游 CSV 转义缺陷；额外防护表格公式注入 |
| SHA-256、随机字符串 | 使用浏览器 Web Crypto。随机字符串使用拒绝采样，未复用上游 Math.random 随机实现 |

所有新增界面、目录、搜索词、发现区及测试均为 ToolBox CN 改动（2026-11-09），沿用 GPL-3.0-only。完整对应源码、上游代码与第三方许可随 `npm run build` 重新打包。

## 0.3.0-dev 扩展

固定 sharevb/it-tools `b5eace85dbdb247f832b2aa9967b9d570a84d1ce`，原码位于 upstream-sharevb/。新增 25 项的逐项来源、库复用、改写范围与未接入项见 [UPSTREAM-EXPANSION.md](docs/UPSTREAM-EXPANSION.md)。`src/vendor/markdown-table.ts` 保留上游生成和转义函数，删去反向解析及宿主 i18n；`pdf-worker.js` 适配上游 QPDF 调用；`regex-worker.js` 适配匹配循环并增加隔离和限制。保留 GPL-3.0-only。

公开分发范围：保留两个上游的源码模块、构建配置、GPL 与原版权。sharevb/public 中未使用的预编译第三方资源不随本产品重新分发，humans.txt 署名保留；原始完整快照和旧 QA/发布归档仍保存在维护者工作区。精确清单见 docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json。55 项实际工具及构建所需资源完整保留。历史 QA 中 2624 文件逐字节核验针对原工作区快照，不代表公开包包含未使用的二进制资源。

Public distribution retains upstream source modules, build configuration, GPL and original notices. Unused precompiled third-party assets under sharevb/public are omitted (humans.txt retained); see docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json. All 55 tool sources and required runtime assets remain included. The untouched full snapshot and frozen release archives remain in the original workspace.
