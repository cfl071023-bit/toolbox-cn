# README 与发布介绍截图清单

由 `scripts/screenshots.mjs` 从真实运行页面捕获，不使用合成 UI、虚构用户数或未实现功能。运行脚本需要本地服务器可用，默认访问 http://127.0.0.1:5178/。截图不改变产品视觉设计。

| 文件（docs/screenshots/） | 目标尺寸 | 用途 |
| --- | --- | --- |
| homepage-zh-light-desktop.png | 1600×1000 | 中文 README 首图；发布介绍的产品概览 |
| homepage-en-light-desktop.png | 1600×1000 | 英文 README 首图；国际化说明 |
| homepage-zh-dark-desktop.png | 1600×1000 | 深色主题对照 |
| homepage-zh-mobile.png | 390×844 | 响应式布局展示（模拟视口） |
| chinese-search.png | 1600×1000 | 中文自然语句发现工具的实际结果 |
| json-working.png | 1440×1000 | JSON 实际处理前后结果 |
| image-compression.png | 1440×1200 | 真实 JPEG 文件、输出预览、体积变化与下载操作 |
| qr-working.png | 1440×1100 | 使用公开示例网址生成的二维码及下载操作 |

README 使用首页、移动版和一张实际工具结果即可；发布介绍按“用户问题 → 首页发现 → 工具处理 → 隐私与 QA → 部署与许可”的顺序选图。不要把模拟手机视口标成实体手机验收。图片压缩使用已有的公开测试照片，来源见 tests/fixtures/README.md；不使用个人照片、真实密码或令牌。

是否已成功捕获、是否做过视觉检查，以 RELEASE-STATUS.zh-CN.md 中本次实际结果为准。列表本身不代表捕获已完成。
