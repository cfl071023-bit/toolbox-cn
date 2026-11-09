# Notices

ToolBox CN is a modified GPL-3.0-only work in the IT-Tools ecosystem.

IT-Tools: Copyright Corentin Thomasset and contributors.
Source: https://github.com/CorentinTh/it-tools
Pinned revision: d505845f918e946ec300af7b36efc107e2f66e9e.

ToolBox CN modifications: Copyright 2026 ToolBox CN contributors.
Modified 2026-11-08: new bilingual interface, catalog, search, navigation, history, favorites, tool integration, compression and tests.
Modified 2026-11-09: QA fixes for mixed-language search, recent ordering, corrupted preferences, asynchronous image reset, JSON number preservation and calendar validation; extended functional, privacy and file-based tests.
Modified 2026-11-09: integrated 22 additional tools, seven categories, discovery sections, bilingual tool options, responsive density improvements and per-tool offline/privacy verification. See REUSE.md for source provenance and adaptations.
Modified 2026-11-09: functional QA only; fixed stale Base64 error/output state when switching modes, added a 30-tool action/invalid-input/mobile/privacy audit and separate production test configuration. Visual styles were preserved.
Modified 2026-11-09: release preparation only; bilingual documentation, original notices and corresponding-source packaging, sanitized distribution copies of QA evidence, screenshots, compatible dependency security updates, and local release archives. No repository creation or deployment.
Modified 2026-11-09 (0.2.0-dev): task-oriented discovery, curated search intents, bilingual action/recovery text, processing and empty-result feedback, mobile navigation/touch improvements, privacy explanations and input-free tool links. All 30 engines and frozen 0.1.0 release artifacts retained; no new dependencies, publication or deployment.

`src/vendor/base64.ts` is copied unchanged from `upstream/src/utils/base64.ts` and remains under upstream's GPLv3 license. Original upstream source and notices are retained in upstream/.

This software is provided without warranty. You may redistribute and modify it under the terms of the accompanying GNU General Public License version 3.

Dependencies retain their respective licenses. See public/THIRD-PARTY-NOTICES.txt and package-lock.json for installed dependencies. Original upstream dependencies and their source metadata are retained in upstream/package.json and upstream/pnpm-lock.yaml; only dependencies in the root package.json are installed for this focused interface.

Modified 2026-11-09 (0.3.0-dev): retained all 30 tools, integrated 25 additional local browser tools; adapted sharevb/it-tools branch chore/all-my-stuffs at b5eace85dbdb247f832b2aa9967b9d570a84d1ce. Original fork source/copyright/license retained in upstream-sharevb/. Added QPDF worker, Markdown table service adaptation, bilingual metadata and tests. See docs/UPSTREAM-EXPANSION.md for exact reuse and rewritten portions. No publication or deployment.

Modified 2026-11-09: GitHub publication preparation, Vite repository base path, base-aware license/source links and GitHub Actions/Pages build verification. Product appearance and all 55 tool engines retained.

公开分发范围：保留两个上游的源码模块、构建配置、GPL 与原版权。sharevb/public 中未使用的预编译第三方资源不随本产品重新分发，humans.txt 署名保留；原始完整快照和旧 QA/发布归档仍保存在维护者工作区。精确清单见 docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json。55 项实际工具及构建所需资源完整保留。历史 QA 中 2624 文件逐字节核验针对原工作区快照，不代表公开包包含未使用的二进制资源。

Public distribution retains upstream source modules, build configuration, GPL and original notices. Unused precompiled third-party assets under sharevb/public are omitted (humans.txt retained); see docs/SOURCE-DISTRIBUTION-EXCLUSIONS.json. All 55 tool sources and required runtime assets remain included. The untouched full snapshot and frozen release archives remain in the original workspace.
