# add-links 命令

向SEO导航站添加新链接的完整流程。

## 使用方法

在Cursor中输入 `@add-links`，然后提供链接列表即可。

## 执行流程

本命令按以下4个步骤执行，详细规则请参考 `.rules/` 目录下的对应文件：

1. **准备分支** - 参考 `.rules/01-prepare-branches.md`
   - 检查Git状态，确保工作区干净
   - 创建稳定版本分支 `stable-v1.X`（可选）
   - 从main创建开发分支 `feature/add-links-YYYYMMDD`

2. **添加链接** - 参考 `.rules/02-add-links.md`
   - 解析用户提供的链接列表
   - 根据链接功能选择合适的分类
   - 将链接添加到index.html的合适位置
   - 维护表格结构（每行4个单元格，更新rowspan）

3. **质量检查** - 参考 `.rules/03-check-quality.md`
   - 检查完全重复的URL（禁止重复，允许同一网站不同页面）
   - 验证链接格式（必须包含target="_blank"，URL以https://或http://开头）
   - 检查表格结构完整性

4. **提交和合并** - 参考 `.rules/04-commit-merge.md`
   - 提交更改到开发分支（清晰的commit信息）
   - 合并到main分支（使用--no-ff保留历史）
   - 创建release分支 `release/vX.Y`
   - 打tag `vX.Y.Z`

## 输入格式

用户提供链接列表，支持以下格式：

### 格式1：结构化格式
```
网站收集
- 工具地址：
  - https://example.com/ 工具描述
- 域名注册：
  - https://domain.com/ 域名工具
```

### 格式2：简单格式
```
- https://example.com/ 工具描述
- https://domain.com/ 域名工具
```

## 链接分类规则

根据链接功能自动分类：

- **社区/论坛** → SEO社区/学习资源
- **关键词工具** → SEO工具/关键词研究
- **流量分析** → SEO工具/网站分析
- **竞争分析** → SEO工具/竞争分析
- **教程/学习** → SEO教程/最佳实践
- **域名相关** → 域名工具
- **AI相关** → AI工具
- **开发辅助** → 开发工具

## 重要规则

1. **禁止完全重复的URL**，但允许同一网站的不同页面
2. **优先填充空单元格**，避免频繁调整rowspan
3. **保持分类逻辑清晰**，相关工具放在同一分类
4. **SEO社区/学习资源应位于表格最上方**
5. **版本号遵循语义化版本规范**

## 输出

- 更新后的 index.html（新链接已添加，无重复，结构完整）
- Git提交记录（开发分支提交 + main分支合并）
- Release分支和Tag（release/vX.Y 和 vX.Y.Z）

## 详细规则文件

- [准备分支规则](.rules/01-prepare-branches.md)
- [添加链接规则](.rules/02-add-links.md)
- [质量检查规则](.rules/03-check-quality.md)
- [提交合并规则](.rules/04-commit-merge.md)
