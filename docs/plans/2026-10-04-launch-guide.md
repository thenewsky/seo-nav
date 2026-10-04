# 上站路线第一版 Implementation Plan

**Goal:** 让网站的第一位用户从零推进首站：明确用途、注册域名、做出可用页面、部署上线、接上统计与 GSC，再逐步优化、获客和经营。

**Architecture:** 保留首页工具聚合和翻石地图，新增上站路线总览及 8 个阶段页。阶段内容以 `start/guide.json` 为唯一来源，零依赖 Node 生成静态 HTML；共用现有导航 CSS 和 favicon 脚本，只增加专题样式。

**Tech Stack:** HTML / CSS / JavaScript / Node.js；无新增构建依赖。

## 范围与基线

- 仓库：`/Users/zhujin05/data/idea-business/05-projects/other/seo/code/seo-nav`。
- 基线：`45ff060cdc57948f90b66485ff7de5af94f6a528`。
- 日期备份：`codex/release-2026-10-04-pre-launch-guide`。
- 开发分支：`codex/launch-guide-2026-10-04`。
- 保留现有 58 个首页外链、翻石地图的 28 条目/6 分类、名称和口号；既有无关工作区文件不纳入提交。
- 新版供用户本地反馈，不合并 main、不触发 Pages 发布。
- business：shared；project：S 计划；输出和允许写入范围仅本独立仓库中本任务文件。
- 采用 writing-plans、frontend-design 和 ego-browser skill；页面样式按用户已确认的系统字体、灰底、蓝色分类与四列工具表执行。
- Skill SHA-256：writing-plans `2046e5b955aa16c288f9c7290c58f237628dfb6ba6d4817fad3da0fa830b46c2`；frontend-design `b19efbc330acb7e4d0650ad402a96adf2a45af614141d64ab50c97036e9ce05b`；ego-browser `9402bf03db895209a755d5e2af9b436dbf98eed0911907110a4ea482c30632de`。源分别为 `~/.agents/skills/writing-plans-0.1.0/SKILL.md`、`~/.agents/skills/frontend-design-3-0.1.0/SKILL.md`、`~/.agents/skills/ego-browser/SKILL.md`。

## 内容契约

- 8 个阶段：用途与需求、域名、建站、部署、统计与收录、页面优化、获客、变现。
- 前 5 阶段承接首站闭环；后 3 阶段作为上线后的扩展路线，不要求新人先完成全部学习。
- 各阶段包含目标、最小路线、动作、完成判据、常见卡点、工具用途及原文出处。
- 哥飞/生财原帖标出作者、标题、平台、日期与原链接；内容用自己的话整理，不转载会员正文，不将 Agent 总结冒充原帖。
- 练手与正式项目分开说明；游戏广告、订阅、按次收费按模式分流，不设置通用搜索量门槛，不复述未核实的历史价格与收款保证。
- 不增加搜索、筛选、下载、卡片、登录、数据库或分成链接。

## 实施任务

1. 内容：创建 `start/guide.json`，核对参考出处和工具用途。
2. 页面：创建两个模板、专题 CSS 与 `tools/build-start.mjs`；生成总览和 8 个阶段 HTML。
3. 入口：仅在首页专题行新增上站路线入口；更新 README 与专题维护规则。
4. 验证：运行两个生成器的 `--check`、语法检查、本地文件与锚点检查；验证首页外链保持一致，工具表每行四个 td、rowspan 和相对路径正确。Pages 工作流上传前同步执行两个生成检查，避免之后内容与产物漂移。
5. 浏览器：ego-lite 中验收首页到路线到阶段到返回、桌面与窄屏表现、代表性原帖和工具链接；本地预览支持 `/seo-nav/` 子路径。
6. 交付：精确暂存任务文件并提交开发分支；保留本地预览地址供用户反馈。

## 验收命令

```sh
node tools/build-discover.mjs --check
node tools/build-start.mjs --check
node --check tools/build-start.mjs
git diff --check
```

## 第一版验收记录（2026-10-04）

- 内容：8 个阶段、37 个步骤、32 个工具入口、18 条资料引用；阶段名称可直接进入内页。
- 生成检查、Node 语法检查和 `git diff --check` 均通过。
- 检查首页、翻石地图与 9 个新页面的本地资源、相对路径及锚点；工具表每行 4 个 td。首页 58 个外链与基线完全一致，翻石地图仍为 28 条目。
- ego-lite 实测首页新窗口进入路线、路线进入阶段、下一阶段、上一阶段、返回首页；桌面及 390px 窄屏显示通过，页面宽度未溢出，表格可用键盘横向滚动。另按 GitHub Pages 的 `/seo-nav/` 子路径验收。
- 论坛标题、作者、日期和 URL 已与本地资料元信息核对。在线抽查已读到部分原文，随后哥飞原站返回 Security Verification；未绕过验证，也未将其视为原链接失效。页面提示原站的登录和会员条件。
- 本地预览 `http://127.0.0.1:8765/start/` 保留供首位用户反馈；此版本为使用验证，尚不代表需求或商业模式已验证。
- 仅提交本任务文件到开发分支；不合并 main、不执行线上发布。交付提交 SHA 以该分支首个改版提交为准。
