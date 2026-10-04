# S 计划

用 AI 做网站、应用或智能体，满足有付费意愿的需求。

Use AI to build websites, apps, or agents that meet needs people are willing to pay for.

收集发现需求、研究关键词、建站与经营产品的常用工具和资源。

## 功能特性

- 📊 分类清晰的SEO工具导航
- 🔍 关键词研究工具集合
- 📈 网站分析和流量工具
- 🎓 SEO学习资源和社区
- 🔗 域名工具和AI工具
- 💻 开发辅助工具
- 🧭 翻石地图：调研方法、工具目录、发布社区、流量与收入榜单、App 数据与软件市场
- 🪜 上站路线：按能力选择四种练习，按卡点查阅八个环节手册、工具与原文资料

## 快速开始

### 查看网站
访问 [GitHub Pages](https://thenewsky.github.io/seo-nav/) 查看在线版本

### 本地运行
```bash
# 克隆仓库
git clone git@github.com:thenewsky/seo-nav.git
cd seo-nav

# 启动本地预览（仅监听本机）
python3 -m http.server 8765 --bind 127.0.0.1
```

打开 <http://127.0.0.1:8765/> 查看首页，点击「翻石地图」进入专题；也可以直接访问 <http://127.0.0.1:8765/discover/>。

### 上站路线

专题保留各自的标题、副标题与导航。共用 `assets/navigation.css` 的字体、背景、分类色和链接交互；路线的目标、步骤及资料按阅读任务分区，工具入口保持四列聚合。翻石地图保留原有标题、引文、导航和分类布局，只收紧尺寸与间距。桌面阶段页使用左侧步骤、右侧工具与原文的布局；1280×800 与 1366×768 下，总览、八个阶段页和翻石地图均按一屏展示验收。小屏保留可读字号，提供页内快捷定位。

从 [练习路线](./start/index.html) 开始，本手册主要用于个人掌握出海 SaaS 工具站流程。按当前能力选择「上线与收录」「出词与点击」「内页扩展」「用户与经营」。总览固定六列：练习、现在你的特征、本轮做什么/先放什么、目标、补齐的能力点、本轮证据和产出物。目标与能力分别描述；产出材料由本人在站外人工准备，页面只展示预期清单。每条路线展开具体动作；准备正式产品时，用户与需求验证可并行开始。「第一站、第二站、第三站」是练习进阶参考，本站按能力重组，也可在已有站上补练，不要求购买固定数量的域名。

[环节手册](./start/workflow/index.html) 保留用途与需求、域名、建站、部署、统计与收录、页面优化、获客、变现八个环节。它们是按需查阅的操作资料，不代表每轮都需做完八项。原八个环节的 URL 保持可访问。当前共 14 个路线页面，均无需 JavaScript 就能阅读和导航。

内容来源为 `start/practice.json`（练习）和 `start/guide.json`（通用环节）；四个模板生成总览、练习页、手册与环节页，同时由相同数据导出 `start/practice.md` 文字版，不单独修改生成产物。原文标出作者、平台、日期和原链接；历史 Agent 对话与论坛原帖分开标注。四层练习是本站整理，不把聊天中的三站口径和群聊总结的七站口径拼成原作者的统一标准。来源与取舍见 [能力练习改版记录](./docs/plans/2026-10-04-practice-path.md)。

```bash
node tools/build-start.mjs
node tools/build-start.mjs --check
```

本地预览：<http://127.0.0.1:8765/start/>。练习页只列本轮相关的环节入口；环节页可返回练习路线与手册。

### 翻石地图

- [专题页面](./discover/index.html)：以彼得·林奇「翻石头最多的人，赢得游戏。」的译文作为副标题，出处为 [PBS FRONTLINE 原始访谈](https://www.pbs.org/wgbh/pages/frontline/shows/betting/pros/lynch.html)。沿用首页的四列分类表格、字体和链接样式，通过浏览器的 `⌘F` / `Ctrl+F` 查找。
- [内容数据](./discover/sites.json)：网站名称、入口、用途、观察重点和必要口径的统一来源。
- 最前面的「调研方法」收录 R01 刘小排翻石头、R02 老布AI图像站实操、R03 哥飞Stripe流量估收入、R04 子木从选品到营销，均链接到生财有术或哥飞社群原帖，阅读需相应权限。
- 「流量与商业榜单」包含 Toolify 收入榜与 Indie Hackers 收入排序入口；「App 数据与榜单」单独收录 Sensor Tower、点点数据、七麦数据和 Data.ai。Data.ai 已被 Sensor Tower 收购，保留原入口并注明现状。

更新内容后，在仓库根目录生成静态页面和Markdown：

```bash
node tools/build-discover.mjs
# 检查网页和Markdown是否与内容数据一致（不写文件）
node tools/build-discover.mjs --check
```

专题使用预生成HTML，完整列表直接显示，关闭JavaScript仍可阅读正文和访问外链。所有站内路径使用相对链接，适用于GitHub Pages的仓库子路径。All Things AI的官网未核对，暂不提供外链；seo.box来源访问榜不作为真实营收排名。

首页与专题共同使用`assets/navigation.css`和`assets/navigation.js`，统一表格、链接悬停效果及favicon加载。首页第一行「专题导航」提供翻石地图入口。

## 添加新链接

### 使用Cursor命令（推荐）

在Cursor中输入 `@add-seo-links` 然后提供链接列表：

```
网站收集
- 工具地址：
  - https://example.com/ 工具描述
- 域名注册：
  - https://domain.com/ 域名工具
```

详细使用说明请查看：
- [COMMAND_GUIDE.md](./COMMAND_GUIDE.md) - 完整命令使用指南
- [QUICK_START.md](./QUICK_START.md) - 快速开始指南
- [ADD_LINKS_GUIDE.md](./ADD_LINKS_GUIDE.md) - 详细操作指南

### 手动添加

1. 编辑 `index.html`
2. 找到对应的分类模块
3. 在空单元格中添加链接：
```html
<td><a href="https://example.com" target="_blank">显示名称</a></td>
```

## 项目结构

```
seo-nav/
├── index.html              # 主页面
├── assets/
│   ├── navigation.css     # 首页与子页共用的导航样式
│   └── navigation.js      # 共用的favicon加载
├── discover/               # 翻石地图二级页面
│   ├── sites.json          # 内容数据
│   ├── index.template.html # 页面模板
│   ├── index.html          # 生成的静态页面
│   ├── sites.md            # 生成的Markdown清单
│   └── styles.css          # 专题样式
├── tools/build-discover.mjs # 零依赖内容生成器
├── start/                  # 练习总览、4 种练习、手册与 8 个环节页
│   ├── guide.json          # 通用环节、动作、工具与原文资料
│   ├── practice.json       # 四种能力练习、目标、技能、预期材料与相关环节
│   ├── practice.md         # 同源生成的完整文字版
│   ├── index.template.html # 能力练习总览模板
│   ├── practice.template.html # 练习页模板
│   ├── workflow.template.html # 通用环节手册模板
│   ├── stage.template.html # 环节页模板
│   ├── styles.css          # 路线专题样式
│   ├── index.html          # 生成的能力练习总览
│   ├── workflow/index.html # 生成的环节手册
│   └── <id>/index.html     # 生成的练习或环节页
├── tools/build-start.mjs   # 零依赖路线生成器（支持 --check）
├── .cursorrules            # Cursor命令规范
├── add-seo-links.md        # 命令文件
├── .cursor/                # Cursor配置目录
│   └── commands.json       # 命令配置
├── .rules/                 # 规则文件目录
├── .seo-nav-rules.md       # 操作规范文档
├── COMMAND_GUIDE.md         # 命令使用指南
├── QUICK_START.md          # 快速开始指南
├── ADD_LINKS_GUIDE.md      # 详细操作指南
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Pages部署配置
```

## 分类说明

- **SEO社区/学习资源** - 社区论坛和学习平台
- **SEO工具/关键词研究** - 关键词挖掘和研究工具
- **SEO工具/网站分析** - 网站流量和分析工具
- **SEO工具/竞争分析** - 竞争分析和关键词难度
- **SEO教程/最佳实践** - SEO学习资源
- **域名工具** - 域名查询和注册
- **AI工具** - AI相关工具
- **开发工具** - 开发辅助工具

## 开发规范

详细的操作规范请查看 [.seo-nav-rules.md](./.seo-nav-rules.md)

### 基本原则
- ✅ 禁止完全相同的URL重复
- ✅ 保持分类逻辑清晰
- ✅ 使用简洁明确的中文名称
- ✅ 提交前检查重复链接

## 部署

项目使用 GitHub Pages 自动部署，推送到 `main` 分支后自动更新。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
