# SEO导航站 - 规则文件说明

## 规则文件结构

本目录包含SEO导航站添加链接的标准化流程规则，分为4个步骤：

1. **01-prepare-branches.md** - 准备分支
   - 检查Git状态
   - 创建稳定版本分支（可选）
   - 创建开发分支

2. **02-add-links.md** - 添加链接
   - 理解链接分类
   - 添加链接到index.html
   - 维护表格结构

3. **03-check-quality.md** - 质量检查
   - 检查重复链接
   - 格式验证
   - 结构检查

4. **04-commit-merge.md** - 提交和合并
   - 提交更改
   - 合并到main
   - 创建release分支和tag

## 使用方法

### 在Cursor中使用

使用 `@spec` 命令串联所有规则：

```
@spec add-seo-links
@rules .rules/01-prepare-branches.md
@rules .rules/02-add-links.md
@rules .rules/03-check-quality.md
@rules .rules/04-commit-merge.md
```

### 单独使用某个规则

也可以单独引用某个规则文件：

```
@rules .rules/02-add-links.md
```

## 命令名称

**`add-seo-links`** - 向SEO导航站添加新链接的完整流程

## 输入格式

用户提供链接列表，格式如下：

```
网站收集
- 工具地址：
  - https://example.com/ 工具描述
- 域名注册：
  - https://domain.com/ 域名工具
```

## 输出

- 更新后的 index.html
- Git提交记录
- Release分支和Tag

## 注意事项

1. 所有规则文件都应在 `.rules/` 目录下
2. 规则文件使用Markdown格式
3. 每个规则文件应包含清晰的步骤和验证清单
4. 规则之间应保持逻辑连贯

