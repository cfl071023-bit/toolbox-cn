import fs from 'node:fs';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true}});
const {tools,categories}=await server.ssrLoadModule('/src/catalog.js');await server.close();
const unit=JSON.parse(fs.readFileSync('qa-evidence/platform-expansion-unit.json','utf8'));
const e2e=JSON.parse(fs.readFileSync('qa-evidence/platform-expansion-production.json','utf8'));
const audit=JSON.parse(fs.readFileSync('qa-evidence/platform-expansion-audit.json','utf8'));
const specs=[];function collect(suite){for(const s of suite.specs||[])specs.push(s);for(const s of suite.suites||[])collect(s);}for(const s of e2e.suites)collect(s);
const audited=tools.map(t=>{const spec=specs.find(s=>s.title.startsWith((t.expanded?'PLATFORM:':'AUDIT:')+t.id+' '));const passed=spec?.tests.every(x=>x.results.at(-1)?.status==='passed');if(!passed)throw Error('Missing passed tool audit: '+t.id);return {id:t.id,name:t.name[0],category:categories.find(c=>c[0]===t.cat)[1],new:!!t.expanded,status:'PASS',evidence:spec.file,case:spec.title};});
if(unit.numFailedTests!==0||e2e.stats.unexpected!==0||e2e.stats.expected!==116)throw Error('Tests not completely passed');
fs.writeFileSync('qa-evidence/platform-expansion-summary.json',JSON.stringify({version:'0.3.0-dev',date:'2026-11-09',existing:30,added:25,totalVerified:55,incompleteExposed:0,externalServices:0,unit:{pass:unit.numPassedTests,fail:unit.numFailedTests},productionE2E:e2e.stats,npmAudit:audit.metadata.vulnerabilities,tools:audited,notIntegrated:['PDF compression','OCR','Raster to vector SVG'],notTested:['Physical phones','Firefox','Safari','Public hosting','Maximum-size production workloads','Independent security audit']},null,2)+'\n');
const text=`# ToolBox CN 0.3.0-dev 扩展验证报告

日期：2026-11-09。此报告针对本轮 55 项工具；历史 0.1.0 发布候选和其 QA 保留，不代表本轮已上线。

## 实际结果

| 项目 | 结果 |
| --- | --- |
| 原有工具 | 30，保留并回归 PASS |
| 新增工具 | 25，逐项实际功能、适用按钮、手机操作及离线处理 PASS |
| 总计已验证工具 | **55** |
| 暴露在界面的未完成 / 未验证工具 | 0 |
| 需要外部处理服务的已接入工具 | 0 |
| 单元测试 | PASS，${unit.numPassedTests}/${unit.numTotalTests} |
| 生产浏览器 E2E | PASS，${e2e.stats.expected}/116；失败 ${e2e.stats.unexpected}、跳过 ${e2e.stats.skipped} |
| npm audit（含开发依赖） | PASS，已知漏洞 ${audit.metadata.vulnerabilities.total} |
| 生产构建 | PASS，Vite 本地构建已执行；源码和第三方许可自动生成 |

独立生产冒烟、截图和最终归档复核结果另记于本报告末尾（仅在执行后更新）。

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
${audited.map(t=>`| ${t.name} | ${t.category} | ${t.new?'新增':'保留'} | PASS | #${t.id} |`).join('\n')}

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
`;
fs.writeFileSync('docs/PLATFORM-EXPANSION-QA.zh-CN.md',text);
console.log('PASS: report generated from 55 individual passing production tool audits.');
