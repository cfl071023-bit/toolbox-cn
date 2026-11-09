# ToolBox CN 0.3.0-dev 扩展验证报告

日期：2026-11-09。此报告针对本轮 55 项工具；历史 0.1.0 发布候选和其 QA 保留，不代表本轮已上线。

## 实际结果

| 项目 | 结果 |
| --- | --- |
| 原有工具 | 30，保留并回归 PASS |
| 新增工具 | 25，逐项实际功能、适用按钮、手机操作及离线处理 PASS |
| 总计已验证工具 | **55** |
| 暴露在界面的未完成 / 未验证工具 | 0 |
| 需要外部处理服务的已接入工具 | 0 |
| 单元测试 | PASS，116/116 |
| 生产浏览器 E2E | PASS，116/116；失败 0、跳过 0 |
| npm audit（含开发依赖） | PASS，已知漏洞 0 |
| 生产构建 | PASS，Vite 本地构建已执行；源码和第三方许可自动生成 |

独立生产冒烟、截图和归档复核也已实际执行，结果见文末。

## 实际文件与边界核验

- PDF：生成含文字与不同页尺寸的真实文档；上传合并，下载后用独立 pdf-lib 解析页数与顺序；重排合并、3,1-2 提取、越界页码和损坏文件均实际测试。未做任意 PDF 的版式/签名完整性认证。
- 图片：使用已有 hopper.jpg 实图；裁剪后比较对应像素，缩放后解码核对尺寸，PNG/JPG/WebP 输出 MIME 与下载内容实际核验。
- 二维码：用真实中文网址生成 PNG，再上传识别并比对完整原文；原有生成工具继续由 jsQR 扫描核验。
- 文件校验：浏览器 SHA-256 与 Node crypto 的原始字节摘要比对；Data URL 下载后反解与原文件逐字节比较。
- Markdown：HTML 与可见 iframe 排版、表格转义和 CSV 列数异常；恶意脚本、外部图像/iframe 请求经过实际浏览器监听。
- JSON/XML/TOML：有效/无效输入、JSON 字段乱序相等、数组顺序差异、原型保留字段与冲突路径、TOML 空值拒绝、XML DOCTYPE/外部实体拒绝。
- 计算与代码：闰日、无效日期、负间隔、百分比零分母、不同维度单位；CSS/JS 格式化与压缩保留 URL 字符串和正则语义，不执行输入代码。
- 正则：真实订单捕获组、索引、空匹配推进、危险表达式超时后恢复处理。
- 手机：新工具在 390px 下实际输入/处理；全新工具的中英/明暗布局还在 320、390、768、1440px 视口检查；不代表已在实体手机或所有浏览器验证。
- 隐私：资源加载完成后断网处理，每个新增工具监听非本地请求、POST/上传、页面错误；仅工具 ID/主题/语言持久化。首次加载代码仍需网络。

## 本轮发现与修复

1. 单位库将 1 L 显示为 1000.0000000000001 mL：改为有限结果与 14 位有效数字显示，单元和浏览器复测 PASS。
2. 初版 Markdown 预览出现外部图片请求事件：加入 DOMPurify 清理，禁止预览资源 URL，叠加 sandbox 与 CSP；恶意脚本、外部图片/iframe 复测 PASS。
3. 上游正则式 CSS/JS 压缩会破坏字符串/正则：未照搬该逻辑，换成熟解析器，并测试 URL、空白字符串和正则字面量。
4. 上游正则匹配循环对空匹配/非全局匹配缺少本轮需要的边界：Worker 隔离、超时和匹配数限制，实际超时后可继续使用。
5. 旧浏览器测试仍断言图片分类只有 3 项：扩展后为 6 项，更新断言；第一次开发回归的 1 个 FAIL 如实保留在 development-first 原始报告。生产完整 116 项已 PASS。
6. CSS/JS 解析器由合并大包拆为按语言加载；PDF Worker 只在 PDF 工具打开时加载。原首页视觉未重做。

## 完整工具清单

PASS 指该工具在上述生产 E2E 中有对应的实际功能审计，不表示已穷尽任意数据、所有错误或所有设备。按钮只测试适用项，例如图片不提供文本复制。

| 工具 | 分类 | 范围 | 结果 | 路由 |
| --- | --- | --- | --- | --- |
| 图片压缩 | 图片与设计 | 保留 | PASS | #image |
| 二维码生成 | 二维码工具 | 保留 | PASS | #qr |
| 文字对比 | 文字与文档 | 保留 | PASS | #diff |
| JSON 格式化 | 开发工具 | 保留 | PASS | #json |
| Base64 编解码 | 文件与格式转换 | 保留 | PASS | #base64 |
| 时间戳转换 | 日常实用 | 保留 | PASS | #time |
| UUID 生成 | 开发工具 | 保留 | PASS | #uuid |
| 颜色转换 | 图片与设计 | 保留 | PASS | #color |
| 字数统计 | 文字与文档 | 保留 | PASS | #stats |
| 英文大小写转换 | 文字与文档 | 保留 | PASS | #case |
| 文本去重与排序 | 文字与文档 | 保留 | PASS | #dedupe |
| 网址编码与解码 | 文件与格式转换 | 保留 | PASS | #url-codec |
| 网址结构分析 | 网络工具 | 保留 | PASS | #url-parse |
| JSON 转 YAML | 文件与格式转换 | 保留 | PASS | #json-yaml |
| YAML 转 JSON | 文件与格式转换 | 保留 | PASS | #yaml-json |
| JSON 转 CSV 表格 | 文件与格式转换 | 保留 | PASS | #json-csv |
| CSV 转 JSON | 文件与格式转换 | 保留 | PASS | #csv-json |
| XML 格式化 | 开发工具 | 保留 | PASS | #xml |
| SQL 格式化 | 开发工具 | 保留 | PASS | #sql |
| Markdown 转 HTML | 文字与文档 | 保留 | PASS | #markdown |
| HTML 转义与还原 | 文字与文档 | 保留 | PASS | #html |
| SHA-256 文本摘要 | 开发工具 | 保留 | PASS | #hash |
| 随机字符串生成 | 开发工具 | 保留 | PASS | #token |
| 进制转换 | 开发工具 | 保留 | PASS | #base |
| 温度换算 | 日常实用 | 保留 | PASS | #temperature |
| 罗马数字转换 | 日常实用 | 保留 | PASS | #roman |
| IPv4 子网计算 | 网络工具 | 保留 | PASS | #subnet |
| JWT 内容解析 | 网络工具 | 保留 | PASS | #jwt |
| Wi-Fi 二维码 | 二维码工具 | 保留 | PASS | #wifi |
| SVG 占位图生成 | 图片与设计 | 保留 | PASS | #svg |
| PDF 合并 | PDF 与文档 | 新增 | PASS | #pdf-merge |
| PDF 拆分与提取 | PDF 与文档 | 新增 | PASS | #pdf-split |
| 图片裁剪 | 图片与设计 | 新增 | PASS | #image-crop |
| 图片尺寸调整 | 图片与设计 | 新增 | PASS | #image-resize |
| 图片格式转换 | 图片与设计 | 新增 | PASS | #image-convert |
| 文件指纹校验 | 隐私与安全 | 新增 | PASS | #file-hash |
| 文件转 Base64 | 文件与格式转换 | 新增 | PASS | #file-base64 |
| 识别图片二维码 | 二维码工具 | 新增 | PASS | #qr-read |
| Markdown 预览 | 文字与文档 | 新增 | PASS | #md-preview |
| Markdown 表格生成 | 文字与文档 | 新增 | PASS | #md-table |
| 百分比计算 | 日常实用 | 新增 | PASS | #percentage |
| 常用单位换算 | 日常实用 | 新增 | PASS | #units |
| 日期间隔计算 | 日常实用 | 新增 | PASS | #date-calc |
| 正则表达式测试 | 开发工具 | 新增 | PASS | #regex |
| CSS 格式化与压缩 | 开发工具 | 新增 | PASS | #css-code |
| JS 格式化与压缩 | 开发工具 | 新增 | PASS | #js-code |
| JSON 树状查看 | 开发工具 | 新增 | PASS | #json-view |
| JSON 结构对比 | 开发工具 | 新增 | PASS | #json-diff |
| JSON 转 XML | 文件与格式转换 | 新增 | PASS | #json-xml |
| XML 转 JSON | 文件与格式转换 | 新增 | PASS | #xml-json |
| JSON 转 TOML | 文件与格式转换 | 新增 | PASS | #json-toml |
| TOML 转 JSON | 文件与格式转换 | 新增 | PASS | #toml-json |
| 名单与清单对比 | 文字与文档 | 新增 | PASS | #list-compare |
| 网页代码提取文字 | 文字与文档 | 新增 | PASS | #html-text |
| JSON 展平与还原 | 文件与格式转换 | 新增 | PASS | #json-flat |

## 未接入与未验证

- **NOT TESTED / 未接入**：PDF 压缩（Ghostscript 体积/AGPL）、OCR（模型及离线准确率）、图片转 SVG（追踪后端/许可）。没有占位卡片，也未计入 55。
- **NOT TESTED**：实体手机、Firefox/Safari、公网托管 CSP/缓存、最大文件压力和独立安全审计。
- 已知边界：PDF 拆分输出一份所选页面文档；图片裁剪为数值矩形；图片只支持静态 JPG/PNG/WebP；日期为自然日；JSON 普通数字精度；Markdown 预览不加载远程图片。
- 构建仍有大块警告（按需 Terser/QPDF）和 XML 依赖的 stream 浏览器兼容提示；实际浏览器处理已通过，不将提示隐藏为“零警告”。

## 证据与复现

- qa-evidence/platform-expansion-summary.json：55 项与测试统计。
- qa-evidence/platform-expansion-unit.json：完整单元结果。
- qa-evidence/platform-expansion-production.json：完整生产浏览器结果。
- qa-evidence/platform-expansion-development-first.json：保留第一次开发回归 115 PASS / 1 FAIL。
- qa-evidence/platform-expansion-audit.json：依赖漏洞审计。
- tests/platform.spec.js、tests/platform.test.js：新增功能与边界；原 30 项审计在 tests/audit.spec.js 保留。
- docs/UPSTREAM-EXPANSION.md、UPSTREAM-SHAREVB.json、UPSTREAM-TOOL-INVENTORY.json：上游固定版本、480 目录静态清单和取舍。
- npm test；npm run build；设置 TOOLBOX_BASE_URL=http://127.0.0.1:5180 后 npm run test:e2e；npm run test:smoke。

没有创建仓库、推送、上传或部署。原 release/ ZIP 与 QA 文档保留。

## 最终交付复核

- PASS：最终生产全量 E2E 116/116（包含 Unicode v 模式、emoji 空匹配终止与恢复），失败/跳过/不稳定项均为 0。
- PASS：独立 npm run test:smoke；原有 JSON 和 22 项上一批工具、17 项本轮文字工具、PDF 下载页数、真实 JPEG 缩放、中文二维码识别、GPL 与两份上游源码均通过。
- 初次独立冒烟为 FAIL：从 Markdown iframe 切换到下一工具后，networkidle 生命周期等待超时。定位后改为实际工具标题和处理结果等待；没有跳过功能检查。最初失败日志保留于 platform-expansion-smoke-first-failure.txt，最终成功日志为 platform-expansion-smoke.txt。
- PASS：六张生产截图已生成，中文桌面、手机、PDF 与 Markdown 已人工查看。清单为 SCREENSHOTS-PLATFORM.md。
- PASS：归档逐文件核对两个原始上游的全部 498 + 2126 = 2624 个 tracked 文件，无缺失、无字节改变；ZIP CRC 校验通过。
- PASS：0.1.0 源码/静态 ZIP 的 SHA-256 与原冻结值一致；没有覆盖旧发布归档。
- PASS：最终文档/源码再打包以已测试的 index.html 与全部 assets SHA-256 为基线核对；运行资产保持一致。
- PASS：本机生产预览位于 http://127.0.0.1:5179/。首次加载仍需本机服务器运行；这是本地预览，不是公网部署。
- NOT TESTED：公开部署、实体手机、Firefox/Safari、最大文件压力、独立安全审计。PDF 压缩/OCR/图片矢量化未接入、不计数。

新增证据：qa-evidence/platform-expansion-build.txt、platform-expansion-smoke.txt、platform-expansion-artifacts.json。全部历史 QA 和 release 归档保留。
