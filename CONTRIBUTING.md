# 贡献指南 / Contributing

欢迎提交可复现的错误修复、中文措辞、翻译和无障碍改进。当前阶段不扩展工具数量或重新设计首页。公开仓库尚未创建，不提供虚构的 issue、PR 或联系地址。

Please focus on reproducible bugs, wording, translation and accessibility. Preserve the existing visual identity and current tool scope. No public issue/PR endpoint exists yet.

1. 说明工具 ID、复现步骤、输入示例、预期与实际结果、浏览器版本。请使用脱敏示例，勿提交密码、令牌、个人文件或真实用户数据。
2. Keep fixes scoped. Reuse retained upstream implementations or established libraries, preserve original notices, and document adapted code in REUSE.md.
3. 工具逻辑应在浏览器本地处理。新增请求、分析或数据存储必须明确说明并重新评估隐私标识；不能自动为新代码添加“本地处理”标签。
4. Run `npm test`, the relevant Playwright checks, `npm run build`, and `npm run test:smoke`. Record commands actually executed; label unavailable environments NOT TESTED.
5. 修改可见文本时检查简体中文、英文、浅色、深色及移动视口。Do not make unrelated formatting or visual changes.
6. Contributions to this project are distributed under its GPL-3.0-only terms. Do not submit code or media without compatible rights. Preserve separate dependency licenses and author credit.

报告潜在安全问题时只提交最小脱敏复现，不公开可用凭据。建立公开仓库时，维护者应先配置其私密安全报告渠道。
