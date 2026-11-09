# 上游复核与扩展取舍（2026-11-09）

本轮保留原来的 30 项，接入 25 项，总计 55 项。原首页的颜色、字体、侧栏、卡片和布局系统保留；只增加目录、处理能力及相应控件。

## 固定来源

- 原始基础：[CorentinTh/it-tools](https://github.com/CorentinTh/it-tools)，`d505845f918e946ec300af7b36efc107e2f66e9e`，保留在 `upstream/`。
- 本轮扩展：[sharevb/it-tools](https://github.com/sharevb/it-tools)，默认分支 `chore/all-my-stuffs`，`b5eace85dbdb247f832b2aa9967b9d570a84d1ce`，提交时间 `2026-11-08T18:45:54+01:00`，包版本标签 `2026.10.25`。通过 git ls-remote 和浅克隆实际核验；这是核验时的 HEAD，不保证此后仍为最新。
- 原始 fork 代码完整保留在 `upstream-sharevb/`，未改动；许可证仍为 GNU GPLv3。两个上游的原版权和 LICENSE 均保留。
- `UPSTREAM-TOOL-INVENTORY.json` 列出全部 **480 个工具目录**，含入口存在性、对应工具和选取状态。目录数不代表有 480 个经过我们验证的工具；未选目录明确标为 NOT TESTED。`scripts/upstream-inventory.mjs` 可重建清单。

## 实际集成与复用边界

以下是按普通用户用途筛选的候选。日常价值为产品判断，不是虚构流量或使用量。全部已接入项无需后端或外部服务；手机实际操作、无横向溢出及离线处理见本轮浏览器报告。

| 新增能力 | 上游实现 | 本轮复用与必要适配 | 主要限制 / 风险 |
| --- | --- | --- | --- |
| PDF 合并 | pdf-concat | 沿用 QPDF embedded WASM、文件系统和 --empty/--pages 调用；移到 Worker，增加重排与下载确认 | 总计 50 MB、20 文件；签名失效；不支持加密文件 |
| PDF 拆分与提取 | pdf-extract | 同一 QPDF 页面选择实现，收紧页码格式并增加错误反馈 | 输出一份所选页面 PDF，不是逐页 ZIP |
| 图片裁剪 | crop-image | 适配上游 Canvas 导出路径；使用可复现的原图像素矩形，避免照搬大型拖拽系统 | 不是触屏自由拖拽裁剪；像素范围需在原图内 |
| 图片尺寸调整 | image-resizer | 沿用浏览器 Canvas 等比缩放，收紧内存与像素上限 | 保持比例，只输入宽度；输出 PNG |
| 图片格式转换 | image-converter | 保留 JPG/PNG/WebP 子集，复用现有 Canvas，无需引入 TIFF/GIF/PVR 编解码器 | 静态画面；JPEG 白底；不保留 EXIF |
| 文件指纹校验 | file-hasher | 复用已有 Web Crypto 的 SHA-256，而非整套多算法 WASM | 50 MB；不是病毒检测或来源证明 |
| 文件转 Base64 | base64-file-converter | 使用浏览器 FileReader 对应的 Data URL 路径，复用已有编码能力 | 5 MB；不是加密；本项不负责反向文件解码 |
| 识别图片二维码 | qr-code-decoder | 复用项目已有 jsQR（原为 QA 依赖，现列运行依赖），不引入上游 OTP/ICAL 解析包 | 清晰图片中的一个 QR；仅显示结果，不打开 URL |
| Markdown 预览 | markdown-preview / markdown-to-html | 复用已用的 marked；新增 DOMPurify、禁止资源 URL 和 sandbox/CSP 隔离，避免上游输入持久化 | 预览不加载远程图片；导出的 HTML 源码使用前仍需清理 |
| Markdown 表格 | markdown-table-generator.service.ts | 直接保留 generateMarkdownTable 及转义函数；去掉依赖 mdt2json 的反向解析和 i18n，复用 Papa Parse 输入 | CSV 列数一致；表头为第一行 |
| 百分比计算 | percentage-calculator | 适配同一三种计算公式，增加有限数与零分母校验 | 标准浮点精度，非财务精算 |
| 单位换算 | many-units-converter | 复用 convert 库；提供常用长度、质量、面积、体积、速度子集；速度按 SI 比例换算 | 拒绝跨维度；结果用 14 位有效数字显示 |
| 日期间隔 | days-calculator | 缩为 UTC 日历日期相减，未搬入节假日/国家/地区数据与业务工时体系 | 计算自然日，不算工作日；不含首日 |
| 正则测试 | regex-tester.service.ts | 适配捕获组、索引与多匹配循环；增加 Worker 超时、空匹配推进和 1000 匹配上限 | 1 秒超时；JavaScript 正则语法 |
| CSS 格式化 / 压缩 | css-js-prettify-minify / css-prettifier | 未复用有语义破坏风险的正则压缩，改用 Prettier + CSSO 解析器 | 10 万字符；不执行代码 |
| JS 格式化 / 压缩 | css-js-prettify-minify / javascript-prettifier | 同上，Prettier + Terser；不混淆命名、不进行激进压缩 | 10 万字符；代码需在实际项目验收 |
| JSON 树状查看 | json-viewer | 复用既有 JSON 解析，新增薄 Vue 递归视图；不搬入 schema 编辑器或自动保存 | 5000 节点 / 40 层；标准数字精度 |
| JSON 结构对比 | json-diff | 复用项目已有 diff 库的 diffJson，规范化对象字段序；不引入整套上游递归视图 | 数组顺序有意义；逐行差异，不是 JSON Patch |
| JSON → XML、XML → JSON | json-to-xml / xml-to-json | 沿用上游 xml-js compact 调用；增加严格 XML 校验、单根元素及 DOCTYPE 拒绝 | 保留 _text / _attributes 表示法 |
| JSON → TOML、TOML → JSON | json-to-toml / toml-to-json | 沿用上游 smol-toml parse/stringify | TOML 无 null；拒绝 null 避免丢字段 |
| 清单对比 | list-comparer.service.ts | 保留共同项与两侧独有项语义；以原生 Set 代替两项小型数组依赖 | 按行、区分大小写、去重 |
| HTML 提取文字 | extract-text-from-html | 用 inert template 实现浏览器子集，不搬入 Node HTML 转换栈 | 不推断 CSS 可见性，不执行脚本或请求资源 |
| JSON 展平 / 还原 | json-flatten-nestify | 沿用 flatten-anything / nestify-anything；增加保留字段、点字段和路径冲突检查 | 数组保留整体；拒绝可能丢数据的路径 |

不是把 fork 的所有 Vue 页面直接复制过来：原上游有全局组件、自动存储、Node 兼容层和庞大依赖。我们保留成熟计算库/服务函数及处理方式，以现有产品组件做适配；表中明确列出改写和缩减部分。

## 依赖、包体积及维护

- 常见输入转换继续复用 marked、xml-js、Papa Parse、diff、Web Crypto；jsQR 从测试依赖移到运行依赖。
- 新增运行依赖：qpdf-wasm-esm-embedded、convert、smol-toml、flatten-anything、nestify-anything、prettier、terser、csso、dompurify。`pdf-lib` 仅用于测试下载后的 PDF。
- QPDF npm 包解包约 1.76 MB，构建 Worker 约 1.75 MB，只有进入 PDF 工具时才加载。没有 CDN 或单独下载的 WASM。
- CSS 与 JS 解析器分别按需加载，预热发生在打开对应工具后；首页不加载 PDF Worker 或整套代码解析器。最终构建尺寸见构建日志。
- QPDF Apache-2.0；Prettier/CSSO/convert/jsQR 等 MIT；Terser/smol-toml BSD；DOMPurify 使用 Apache-2.0 许可选项。精确安装版本及全部第三方正文由构建生成 `DEPENDENCY-LICENSES.json` 和 `public/THIRD-PARTY-NOTICES.txt`。
- Worker 超时、输入长度、像素和文件大小限制降低卡顿风险；这不是对任意恶意文件的安全认证。PDF 解析器仍须跟踪安全更新。

## 已调查但未接入（NOT TESTED）

| 候选 | 暂缓原因 | 后续所需验证 |
| --- | --- | --- |
| PDF 压缩 | 上游 ghostscript-wasm-esm 解包约 16.32 MB，声明 AGPL-3.0；移动内存与额外源代码分发须单独处理 | 真实扫描件、矢量 PDF、大小变化、画质、字体及 AGPL 分发审查；不能用普通另存冒充压缩 |
| OCR 图片识字 | 上游 tesseract.js 有本地 worker/core，但中文模型 npm 包本身约 21.88 MB，另有英文模型与 WASM | 自托管离线资源、中英文准确率、旋转照片、低端手机、加载提示及许可 |
| 图片转 SVG | 上游 potrace 页面含 Node Buffer 和多个后端；esm-potrace-wasm 声明 GPL-2.0，尚未确认分发兼容边界 | 真正路径描摹、复杂照片表现、WASM 构建与许可；不以 SVG 包裹位图冒充矢量化 |
| PDF 文本提取、HTML 转 PDF | PDF.js / 分页与浏览器差异增加测试范围 | CJK 字体、分页、复杂 PDF、输出核验 |
| EXIF 查看/删除、图片水印、Markdown 目录、HTML 转 Markdown | 有价值，但本轮以 25 项完整工具为边界 | 真实相机文件、元数据隐私、移动交互或转换保真度 |
| DNS、WHOIS、网站状态、AI、翻译等需要联网的候选 | 往往需要 API、代理、外部站点或密钥，影响隐私和静态部署 | 不在当前本地处理工具集内；未接入、未宣称可用 |

完整清单其余项为未选、未验证的候选，不计入 55 个工具。长期 80–100+ 的目标应继续分批验证，而不是直接挂上 480 张卡片。

## 分发

ToolBox CN 继续 GPL-3.0-only。`NOTICE.md` 标明修改与日期，`REUSE.md` 记录复用边界；对应源码 ZIP 包含两个上游源码目录及其 LICENSE、原版权、应用源码、锁文件、构建脚本和测试。构建自动重打包并提供 `/source.zip`。不得用冻结的 0.1.0 源码搭配本次静态资产发布。

本轮未运行发布打包脚本，未覆盖 0.1.0 release 归档；未创建 GitHub 仓库、上传、推送或部署。
