# ToolBox CN 首轮功能 QA 报告

日期：2026-11-09（Asia/Shanghai）。本轮只做盘点、测试和确认问题修复，没有增加工具或修改首页视觉设计。

## 结论

| 指标 | 结果 |
| --- | --- |
| 检查工具总数 | 30 |
| 在本次 Chromium 测试范围内功能完整 | 30（PASS） |
| 本轮发现产品缺陷的工具 | 1：Base64；已修复并复测 PASS |
| 修复后仍有已知功能缺陷的工具 | 0（FAIL） |
| 未完成或未验证的工具 | 0（NOT TESTED） |
| 阻断交付问题 | 无 |

“功能完整”限于本轮已执行的功能与浏览器范围，并不代表任意输入或所有浏览器均已验证。

## 30 个工具完整盘点

每行的开发/生产状态，均对应独立的 AUDIT:工具ID 浏览器测试。每项测试运行桌面实际处理、现有按钮、异常或边界输入、390px 移动视口实际处理和断网隐私核验；不是只打开界面。所有工具的重置均检查输入、输出与参数恢复；提供示例的工具均实际点击示例并处理。

| # | 工具 | 分类 | 开发功能 | 生产功能 | 异常/边界 | 复制 | 下载 | 重置/示例 | 本地标识 | 移动操作 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 图片压缩 | 图片与设计 | PASS | PASS | PASS | NOT TESTED² | PASS | PASS | PASS | PASS |
| 2 | 二维码生成 | 二维码 | PASS | PASS | PASS | NOT TESTED² | PASS | PASS | PASS | PASS |
| 3 | 文字对比 | 文字与文档 | PASS | PASS | PASS | PASS | NOT TESTED² | PASS | PASS | PASS |
| 4 | JSON 格式化 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 5 | Base64 编解码 | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 6 | 时间戳转换 | 日常实用 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 7 | UUID 生成 | 开发工具 | PASS | PASS | NOT TESTED¹ | PASS | PASS | PASS | PASS | PASS |
| 8 | 颜色转换 | 图片与设计 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 9 | 字数统计 | 文字与文档 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 10 | 英文大小写转换 | 文字与文档 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 11 | 文本去重与排序 | 文字与文档 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 12 | 网址编码与解码 | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 13 | 网址结构分析 | 网络工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 14 | JSON 转 YAML | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 15 | YAML 转 JSON | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 16 | JSON 转 CSV 表格 | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 17 | CSV 转 JSON | 文件与格式转换 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 18 | XML 格式化 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 19 | SQL 格式化 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 20 | Markdown 转 HTML | 文字与文档 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 21 | HTML 转义与还原 | 文字与文档 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 22 | SHA-256 文本摘要 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 23 | 随机字符串生成 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 24 | 进制转换 | 开发工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 25 | 温度换算 | 日常实用 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 26 | 罗马数字转换 | 日常实用 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 27 | IPv4 子网计算 | 网络工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 28 | JWT 内容解析 | 网络工具 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |
| 29 | Wi-Fi 二维码 | 二维码 | PASS | PASS | PASS | NOT TESTED² | PASS | PASS | PASS | PASS |
| 30 | SVG 占位图生成 | 图片与设计 | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS |

¹ UUID 是无输入生成器，没有“非法用户输入”场景；已验证生成结果的 UUID v4 格式、连续生成及去重，不因此视为未完成。

² 该界面没有此按钮：图片、二维码与 Wi-Fi 二维码提供图片下载而不提供文字复制；文字对比提供修改后文字复制而不提供下载。没有为本轮增加新功能。NOT TESTED 在这些格子表示不适用的按钮，不是存在但未验证的按钮。

字数统计、SHA-256 和文字对比允许任意文字，异常/边界检查采用空输入、已知空字符串摘要或空差异。密码/随机字符串检查长度越界；SVG 检查尺寸越界。其余解析/转换工具分别输入了非法语法、非法编码、损坏文件或非法数值。

## 重点工具的真实数据

- 图片压缩：上传磁盘上的真实 hopper.jpg（128×128、6,412 字节），解码输出检查尺寸；原有质量 65% 场景下载为 4,257 字节。另测试现有 banner.png（1280×640，158,856 → 46,076 字节）。检查 JPEG 文件头、实际下载内容、损坏图片、超 25 MB、WebP、透明背景变白和结果增大提示。
- 二维码：中文、表情、带中文查询的网址、Wi-Fi 文本均生成 PNG，并用独立 jsQR 解码，比较原文。额外检查 Wi-Fi SSID/密码特殊字符、开放网络、空内容与过长内容。这里的“可扫描”指软件解码通过；实体手机扫码为 NOT TESTED。
- JSON：嵌套对象、中文、数组、标量、无效语法；保留大整数和长小数原文；复制与下载内容一致，非法输入报错且保留原文。
- 文字比较：两段真实中文文本分别包含“苹果”和“香蕉”，检查新增和删除标记；空文本不产生错误差异，script 字样作为文字处理。
- Base64：中文和表情进行编码，再解码还原；非法编码报错；切换模式不残留上次错误。
- 时间戳：秒、毫秒、带 +08:00 的 ISO 时间对应同一 UTC；测试闰年与不存在的日历日期。

## 整体应用

| 项目 | 状态 | 已执行范围 |
| --- | --- | --- |
| 中文/英文切换 | PASS | 原有与新增工具标题、参数、输入保持、语言偏好刷新恢复 |
| 中文同义词/自然语句与英文搜索 | PASS | 图片变小、字数统计、文本差异、JSON/YAML/CSV 转换方向、Wi-Fi、子网、SHA-256 等 |
| 收藏与最近使用 | PASS | 新旧工具收藏、取消、刷新恢复、去重、最近使用顺序 |
| 深色/浅色 | PASS | 往返切换与刷新恢复；两种语言下布局检查 |
| 桌面/移动布局 | PASS | 1440、768、390、375、320px 视口；每个工具均在 390px 实际运行处理；移动菜单/分类可操作 |
| 导航与刷新 | PASS | 全部 30 个卡片路由、工具 URL 刷新、返回首页与偏好存储损坏恢复 |
| 实体手机、Safari、Firefox | NOT TESTED | 当前环境只执行 Windows Chromium 与移动视口模拟 |

## 本轮发现和修复

**FAIL → PASS：Base64 旧错误状态残留。** 先输入非法 Base64 并解码，出现错误后切回编码模式，旧错误仍显示。已将两个模式按钮接入既有 invalidate() 逻辑，同时清理输出、错误并取消过期处理任务。新增回归测试在开发版和生产版均实际执行通过。未改动配色、字体、侧栏、卡片或首页布局。

**测试适配，不计为产品缺陷：Windows 换行。** 首轮复制精确比较将 Windows 剪贴板的 CRLF 与页面 LF 判为不同。内容没有丢失；对复制结果按平台换行规则归一后比较。下载文件仍按实际 UTF-8 字节内容比较，没有放宽为只检查文件名。

样式文件保持不变，最终 SHA-256：

- src/style.css：`18999037d1cd9e3b7b5e55fe7c4b73e775f23836a67a7caf802d1aa98c58a437`
- src/density.css：`5afff605e6f12061b209191c20e703e5615b8e45cf002ccaecbd2c05c5ad1337`

## 隐私核验

PASS：30 个工具均在页面及按需资源加载完成后断网执行主操作，并核对结果。监听 HTTP 请求及 WebSocket，未发现向外站发送数据、POST 等写入请求或外部 WebSocket；localStorage 仅出现语言、主题、收藏工具 ID、最近工具 ID 四个偏好键，sessionStorage 为空，处理内容未持久保存。生产版也独立运行同一批检查。

因此当前 30 个本地处理标识与本轮证据一致。首次加载网页及工具代码仍需网络；这不等于首次离线可打开网站，也不涵盖浏览器扩展和操作系统。外部开源链接仅在用户主动点击时跳转。这里是功能性核验，不是第三方渗透测试或安全认证。

## 实际测试与构建

| 命令/检查 | 状态 | 实测结果 |
| --- | --- | --- |
| npm test | PASS | 58/58 单元测试 |
| npm run test:e2e | PASS | 77/ 77；失败 0；跳过 0 |
| npm run build | PASS | 静态生产资源、按需工具分包、开源许可与完整对应源码打包成功 |
| 对 dist 执行完整浏览器测试 | PASS | 77/ 77；失败 0；跳过 0 |
| node scripts/production-smoke.mjs | PASS | JSON 与全部新增工具实际输出，许可证与源码下载 |

开发与生产测试结果分别为 [development.json](qa-evidence/development.json) 和 [production.json](qa-evidence/production.json)。测试代码见 tests/audit.spec.js，以及现有 browser.spec.js、qa.spec.js、expansion.spec.js。此次加入了独立的生产测试 URL 配置，生产测试针对构建后的静态产物，不用开发服务器代替。

构建有一条 sax 依赖的 Node stream 浏览器兼容提示；不是构建失败。生产 XML 实际处理、非法标签报错及完整浏览器测试均已执行，未因此发生运行错误。没有将“构建成功”表述为“零警告”。

## 剩余边界与阻断

阻断问题：无。工具数量保持 30，没有增加新功能。

- NOT TESTED：实体手机、Safari/Firefox、浏览器插件环境、独立安全审计、极端压力/性能上限；不能据此承诺所有设备或任意超大输入均正常。
- 既有限制：图片统一导出 JPEG、透明背景变白；JWT 只解码不验证签名；网络工具不做远程探测；JSON/YAML/CSV 互转使用常规数字精度，精确大数应使用字符串；Markdown 输出是 HTML 源码，不在本页执行，嵌入其他网站前应清理。
- SHA-256 接收空字符串是合法行为；随机 UUID 没有非法输入一项。不存在的复制/下载按钮未伪称经过测试。
