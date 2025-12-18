# SEO导航站

一个简洁美观的SEO工具导航网站，帮助SEO从业者快速访问常用工具和资源。

## 功能特性

- 📊 分类清晰的SEO工具导航
- 🔍 关键词研究工具集合
- 📈 网站分析和流量工具
- 🎓 SEO学习资源和社区
- 🔗 域名工具和AI工具
- 💻 开发辅助工具

## 快速开始

### 查看网站
访问 [GitHub Pages](https://your-username.github.io/seo-nav/) 查看在线版本

### 本地运行
```bash
# 克隆仓库
git clone <repository-url>
cd seo-nav

# 直接用浏览器打开
open index.html
```

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
