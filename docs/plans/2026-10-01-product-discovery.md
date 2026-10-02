---
sources: [scys:5021, scys:4077, xiaoketang:162, scys:5338]
---

# S 计划 / 翻石地图：本地验收版

business: shared
project: seo-nav
status: ready-to-publish

## 用户场景与边界

用户正在共同学习从Toolify认识类目、用户场景与生意，已经积累了一份网站入口清单，希望将其整理为SEO导航站的二级页面，并保留Markdown版本。已有行为证据是本次多轮清单整理与明确的页面制作请求。这里验证导航与内容呈现的可用性，不推定新产品的商业需求或付费意愿。

现状是聊天表格和研究目录里的清单，日常访问、筛选及后续复用不便。本版先通过一个静态专题页面和首页入口，验证是否便于用户找网站、理解用途并导出资料。

授权顺序：先本地实现、浏览器核查并由用户验收；2026-10-02用户明确授权「先部署吧。后续我再改问题不大」，本轮据此提交网页内容并推送到main，由现有GitHub Pages工作流发布。现有`.claude/settings.local.json`修改和未跟踪`CLAUDE.md`不纳入本次提交。

## 页面设计

- 路由：`discover/index.html`，首页以`discover/`相对链接进入，兼容GitHub Pages子路径。
- 内容：本轮已经记录的28个入口。最前面以「调研方法」单列R01–R04原文；随后按AI工具目录、产品发布与社区、流量与商业榜单、App数据与榜单、应用与软件市场整理24个网站与榜单入口。先读方法，再从Toolify认识类目和生意。
- 视觉：按用户验收反馈，完全沿用主站字体、灰底、白色表格、蓝色分类标题、边框、行高和favicon链接；取消专题横幅、大标题、卡片及独立配色。
- 内容布局：主站同样的“分类th + 四个网站td”导航表格。链接名称直接访问网站，单元格中简短说明用途，详细观察内容保留在Markdown及必要提示中。
- 命名：主站「S 计划」，副标题采用用户确认的中英文版本「用 AI 做网站、应用或智能体，满足有付费意愿的需求。」与「Use AI to build websites, apps, or agents that meet needs people are willing to pay for.」；子页「翻石地图」，副标题引用彼得·林奇「翻石头最多的人，赢得游戏。」的中文译文。
- 交互：完整分类表格直接显示，通过浏览器`⌘F` / `Ctrl+F`查找。删除自建搜索、分类筛选、清除按钮及相应脚本和样式；页面不提供Markdown下载。
- 入口：首页原工具表格增加一行“专题导航 / 翻石地图”，入口链接沿用其他网站链接样式；首页不再提供重复的Markdown清单入口。
- 样式与favicon逻辑抽为`assets/navigation.css`、`assets/navigation.js`，供首页和二级页共同引用，以免两页风格漂移。
- 内容口径：不写世界第一/第二等未核排名；seo.box/referring按Stripe结账页来源网站榜描述；All Things AI保留官网待核状态，不编造外链。

## 文件与协作约定

- 主Agent：`index.html`首页入口、`assets/navigation.css`和`assets/navigation.js`、README、本记录、集成生成、预览与验收。
- 内容子Agent：只编写`discover/sites.json`，以用户已确认的入口为边界；本轮TrustMRR追加由主Agent完成。
- 页面子Agent：`discover/index.template.html`、`discover/styles.css`、`discover/discover.js`、`tools/build-discover.mjs`。不改首页与数据。
- `discover/index.html`和`discover/sites.md`由主Agent在集成时调用生成器生成；网页表格与Markdown来自同一份数据。

数据契约：顶层`updated`、`groups`、`sites`。group为`id`、`label`、`description`；site为`id`、`name`、`url`（仅未核入口为null）、`group`、`summary`、`observe`、`note`、`featured`（仅Toolify为true）。文章入口可带`source_key`，生成Markdown时汇总为`sources`元信息。各文本为中文，名称保留品牌原名。

## 验收与停止条件

通过：28个入口及用户指定入口都可定位；调研方法位于最前、R01–R04均指向原文；App数据与榜单单独分类；主站与二级页基础样式及链接样式一致；表格每行四个网站单元格；外链有明确名称和用途；未知官网无伪造链接；首页可进入子页并返回；桌面及手机无整页横向溢出，手机表格在区域内横向滚动；无额外搜索、筛选或下载控件，浏览器查找可用。

调整：用户认为分组、视觉或文案不适合日常使用时按反馈修改。停止：没有发布授权时停止于可运行预览；本轮已有用户明确发布授权。

## 应用的Skill

- `/Users/zhujin05/.agents/skills/brainstorming-0.1.0/SKILL.md`：理解场景、确定设计。用户已明确要求直接实现一版，本次用具体本地版本验收，不重复索取实施许可。
- `/Users/zhujin05/.agents/skills/frontend-design-3-0.1.0/SKILL.md`：页面与入口模块视觉实现。
- `/Users/zhujin05/.agents/skills/ego-browser/SKILL.md`（2.0.0）：本地浏览器功能和视觉核查。

允许写入范围仅为seo-nav本次页面、首页入口、内容数据和配套文档；不改其他业务、论坛原始资料或旧研究结果。

## 第一版本地核查记录（独立视觉设计已被用户否决）

- 分支：`codex/product-discovery-20261001`，尚未commit、push或触发GitHub Pages发布。
- 首页：<http://127.0.0.1:8765/>；专题：<http://127.0.0.1:8765/discover/>。
- Markdown：`discover/sites.md`，由`sites.json`生成；实际浏览器下载与该文件逐字节一致。
- 生成器语法、交互脚本语法以及生成结果一致性检查通过；本次文件`git diff --check`通过。
- 页面包含17项、16个唯一HTTPS外链；All Things AI无伪造链接。Markdown包含相同17项。
- 原首页58个外链保留，17个表格行仍各有4个td；增加专题入口后允许整页纵向滚动，窄屏工具表格在自己的区域横向滚动。
- ego-lite实际操作：四类筛选结果8/3/3/3、分类与Show HN搜索组合、中文“结账”搜索、无结果提示、清除恢复、Toolify锚点恢复全部、首页与专题往返、Markdown下载均通过。
- 1440px桌面与375px手机无整页横向溢出，手机卡片单列；手机起点标题修为明确两行。
- 在浏览器禁用JavaScript并重新加载后，17个静态卡片和16个外链保留，筛选控件保持隐藏；恢复JavaScript后控件重新可用。
- 预览服务保持运行供用户验收；下一步等待本地验收意见，再修改或发布。发布时只提交本任务文件，不包含已有CLAUDE.md和`.claude/settings.local.json`改动。

## 本次验收反馈

用户明确要求：子页面与主站同一风格，link样式一致；主站紧凑、能容纳较多信息的表格设计已经满足需求，不需要额外设计。本次修订仅落实这项反馈，内容清单和先本地验收再发布的顺序保持。

本次用户指定的风格要求优先于frontend-design Skill的一般字体与视觉差异化建议。

## 修订版本地核查结果

- 页面改为四列分类表格：17个网站、4类、5个表格行，每行4个td；不再包含独立视觉主题或卡片。
- 首页入口为原表格首行「专题导航」，有产品发现与Markdown清单两个链接；原58个外链保留，表格共18行。
- 两页共用CSS和favicon脚本。浏览器比较body、h1、table、th、td、td a、td a img的字体、字号、颜色、背景、padding、边框颜色和gap，49个计算样式均一致。
- 链接悬停实测为主站的`#1890ff`文字、`#e6f7ff`背景；外链以品牌名称呈现，favicon为16px。
- 分类筛选8/3/3/3项，表格行数2/1/1/1；筛选与搜索组合、中文检索、空结果及复位通过。复位后17条与16个favicon节点保留，rowspan与空td排列正确。
- 1440px桌面展示完整列表；375px手机整页无横向溢出，760px表格仅在344px容器内横向滚动。
- 浏览器关闭JavaScript后仍有17项、5行，筛选控件隐藏且表格可读。Markdown实际下载与生成文件逐字节一致，内容较首版未改。
- 新公共脚本与修订脚本语法检查通过，生成器一致性及diff空白检查通过。
- 原本地预览地址保持，服务仍运行；状态继续为等待用户本地验收，未commit、push或发布。

## 命名与精简版本地核查结果

- 用户要求：删除首页「网站清单」入口，子页使用浏览器查找，主站以S计划命名，子页结合石头意象命名，其他不动。
- 主站改为「S 计划 / 从需求出发，把产品做成生意。」；其定位沿用仓库愿景与本次任务：发现真实需求、小步验证、上线并经营产品。
- 子页改为「翻石地图 / 看产品，问需求，辨生意。」；首页入口、页签标题、返回链接与Markdown标题同步。
- 首页只保留一个子页入口；子页删除搜索框、分类选择、复位及空结果交互，移除`discover.js`和相应样式、生成标记。
- 修改前后核对：原首页58个外链、子页17项内容和分类顺序、Markdown各类表格正文、favicon逻辑保持一致。首页18行、子页5行，每行均有4个td。
- 生成器一致性与diff空白检查通过。ego-lite本地核对两页名称、slogan及入口；子页无input/select/button，17个入口全部显示；桌面与375px窄屏无整页横向溢出。
- 保留现有预览服务与地址供用户验收。状态仍为`awaiting-local-review`，未commit、push或发布。
- 用户进一步明确S计划的目标是找到未被满足的付费需求，以针对性的产品承接流量。本地首页文案调整为「找到未被充分满足的付费需求，做产品解决问题，把流量变成收入。」；「未被充分满足」覆盖已有收费产品的缺口，产品价值与流量转化分别表达。首页页签和README同步，其他页面与样式不改。
- 用户要求子页使用名言引用，并明确没有下载诉求。本轮保留「翻石地图」名称，删除子页「下载 Markdown」链接，以「翻石头最多的人，赢得游戏。」——彼得·林奇替换副标题。引用为中文译文，原句已在 [PBS FRONTLINE 访谈](https://www.pbs.org/wgbh/pages/frontline/shows/betting/pros/lynch.html)中核对；HTML的`q cite`保留出处。主站slogan候选尚未选择，本轮不修改主站副标题。
- 本轮生成结果一致性与diff空白检查通过。ego-lite刷新子页后核对：引文及出处正确，下载链接为0，页面导航仅保留「返回 S 计划」，17个入口仍显示；本地预览继续等待验收。
- 用户明确指定主站副标题原文，本轮据此替换首页副标题并同步README，页签简写为「S 计划 · 高效的赚钱」。保留用户的`keyword>1 gpts，5000/day`写法，不解释或修改其中的指标。样式和子页不改，继续先本地验收再发布。
- 用户明确要求追加TrustMRR，本轮加入「流量与商业榜单」首位，总数更新为18。官网为`https://trustmrr.com/`；核对其[官方介绍](https://trustmrr.com/about)与[数据文档](https://trustmrr.com/docs/api/list-startups)，按通过接入支付平台验证收入的产品榜单描述，区分MRR、近30天收入和利润。未新增控件或改动页面样式，继续本地验收。
- 2026-10-02：用户确认新版说明，首页以原有灰色副标题样式分两行显示中英文「用 AI 做网站、应用或智能体，满足有付费意愿的需求。」与「Use AI to build websites, apps, or agents that meet needs people are willing to pay for.」。页签标题简化为「S 计划」，README同步；继续本地验收。
- 2026-10-02：用户要求补齐入口并单列App分类。新增「App 数据与榜单」，收录[Sensor Tower](https://sensortower.com/)、[点点数据](https://www.diandian.com/zh)、[七麦数据](https://www.qimai.cn/)及[Data.ai](https://www.data.ai/en/)；「流量与商业榜单」补充[Toolify收入榜](https://www.toolify.ai/zh/Best-AI-Tools-revenue)和[Indie Hackers收入排序](https://www.indiehackers.com/products?sorting=highest-revenue)。共24个入口、5类。Toolify排名依据支付平台排名与流量推算；Indie Hackers包含自报收入，现场看到异常大额，保留核对提示。Data.ai已被Sensor Tower收购，当前入口跳转登录页，收购状态依据[官方公告](https://sensortower.com/press/press-release-sensor-tower-acquires-market-intelligence-platform-data-ai)。下载、收入及排名口径在各入口说明中区分，页面继续沿用原表格样式。

- 2026-10-02：用户指定先前评审的R01–R04作为重点学习材料，在最前面新增「调研方法」一栏。R01原文为[刘小排：翻石头](https://scys.com/deepsea/2001/note/5021)，R02为[老布：AI图像站实操](https://scys.com/deepsea/2001/note/4077)，R03为[哥飞：Stripe流量估收入](https://new.web.cafe/topic/wlzf10yky8)，R04为[子木：从选品到营销](https://scys.com/deepsea/2001/note/5338)。生财分享入口给出`/deepsea/2001/note/<id>`形式，三篇均实际打开并核对标题、作者；R03依据原文元信息确认地址，打开时出现Security Verification，已交回用户验证。保留简短学习重点与原评审中的边界；共28个入口、6类，样式沿用原表格。

- 本轮本地核查：调研方法为第一组，四个原帖链接均以新标签打开；共28个入口、6个分类、8行表格，每行4个td，原24个入口内容全部保留。生成器一致性检查通过，本地HTTP预览可读取新版页面；按资料源规则重建小课堂引用索引。R03原站在线读取仍待用户完成验证，未发布到GitHub。

## Skill文件指纹

- `/Users/zhujin05/.agents/skills/brainstorming-0.1.0/SKILL.md`：SHA-256 `206c63e80d38c57e6afc657296332b1d0ff75572435d75c079e7407b26762ecd`
- `/Users/zhujin05/.agents/skills/frontend-design-3-0.1.0/SKILL.md`：SHA-256 `b19efbc330acb7e4d0650ad402a96adf2a45af614141d64ab50c97036e9ce05b`
- `/Users/zhujin05/.agents/skills/ego-browser/SKILL.md`：SHA-256 `9402bf03db895209a755d5e2af9b436dbf98eed0911907110a4ea482c30632de`
