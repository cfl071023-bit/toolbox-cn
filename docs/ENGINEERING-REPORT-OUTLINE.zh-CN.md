# 工程报告提纲（基于实现证据）

## 1. 产品目标与交付范围

- 中文优先的免费工具箱；30 个工具、七类任务，不需要账户。
- 本轮保持界面与工具数量，准备文档、可分发产物与部署步骤；没有上线。
- 证据：src/catalog.js、src/extra-catalog.js、完整工具盘点 FUNCTIONAL-QA.zh-CN.md。

## 2. 技术结构与选型

- Vue + Vite 静态前端、hash 路由、按需加载 advanced 工具模块。
- localStorage 只保存语言、主题、收藏与最近工具 ID；处理输入保留在页面内存。
- 证据：src/App.vue、src/core.js、src/advanced.js、src/storage.js、vite.config.js。

## 3. 上游复用与开源边界

- CorentinTh/it-tools 精确提交、上游 package 版本标签与实际提交的区别。
- 原样复用与适配、库集成、单独实现的安全随机数和标准 CSV 处理。
- 证据：REUSE.md、NOTICE.md、upstream/、docs/LICENSE-AUDIT.zh-CN.md。

## 4. 功能与质量证据

- 原首轮 58 项单元测试；开发/生产各 77 项浏览器检查。
- 每个工具的输出、按钮、异常或边界、移动操作和断网运行。
- 真实 JPEG/PNG、独立二维码解码、JSON 大数保留、CSV 转义和公式注入防护。
- 证据：tests/、qa-evidence/、FUNCTIONAL-QA.zh-CN.md；本次重新执行的结果以 RELEASE-STATUS.zh-CN.md 为准。

## 5. 已确认问题与修复

- Base64 切换模式残留错误：复现、invalidate 修复、回归测试。
- 发布检查发现 QA 路径泄露：保留原始记录，分发副本脱敏。
- 依赖审计：记录实际 npm 审计、是否完成兼容更新、复测和剩余阻断；不能把构建成功当作安全审计通过。

## 6. 构建、分发与部署

- 对应源码、第三方声明、静态产物、SHA-256 和发布清单。
- 原项目和 QA 证据保留；归档排除 Git、依赖目录、日志、缓存和个人路径。
- 纯静态根路径部署、HTTPS、hash 路由、同版本源码可访问、原子更新和回滚。
- 证据：scripts/source.mjs、scripts/release-package.mjs、SOURCE-CODE.md、docs/DEPLOYMENT.md。

## 7. 视觉与验收边界

- 使用实际页面截图，不改设计，不伪造指标。
- 标明实体手机、Safari/Firefox、公网托管和独立安全审计仍未执行。
- 后续优先处理剩余阻断，再申请上线批准；本报告不代表授权部署或创建仓库。
