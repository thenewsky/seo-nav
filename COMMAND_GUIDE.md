# SEO导航站 - 添加链接命令使用指南

## 命令名称
**`add-seo-links`** - 向SEO导航站添加新链接的标准化流程

## 命令用途
此命令用于向SEO导航站（index.html）添加新的链接，遵循标准化的Git工作流和代码规范。

## 在Cursor中使用

### 方法1: 使用 @spec 串联所有规则（推荐）

```
@spec add-seo-links
@rules .rules/01-prepare-branches.md
@rules .rules/02-add-links.md
@rules .rules/03-check-quality.md
@rules .rules/04-commit-merge.md
```

然后提供链接列表，例如：
```
网站收集
- 工具地址：
  - https://example.com/ 工具描述
- 域名注册：
  - https://domain.com/ 域名工具
```

### 方法2: 分步骤执行

如果需要分步骤执行，可以单独引用规则：

**步骤1: 准备分支**
```
@rules .rules/01-prepare-branches.md
```

**步骤2: 添加链接**
```
@rules .rules/02-add-links.md
```
然后提供链接列表

**步骤3: 质量检查**
```
@rules .rules/03-check-quality.md
```

**步骤4: 提交和合并**
```
@rules .rules/04-commit-merge.md
```

## 输入格式

用户提供链接列表，支持以下格式：

### 格式1: 结构化列表
```
网站收集
- 工具地址：
  - https://example.com/ 工具描述
- 域名注册：
  - https://domain.com/ 域名工具
```

### 格式2: 简单列表
```
- https://example.com/ 工具描述
- https://domain.com/ 域名工具
```

### 格式3: 带分类说明
```
工具地址：
- https://example.com/ 工具描述
- https://another.com/ 另一个工具

域名注册：
- https://domain.com/ 域名工具
```

## 输出

执行完成后，将得到：

1. **更新后的 index.html**
   - 新链接已添加到合适分类
   - 表格结构完整
   - 无重复链接

2. **Git提交记录**
   - 开发分支提交
   - main分支合并
   - 清晰的提交信息

3. **Release分支和Tag**
   - release/vX.Y 分支
   - vX.Y.Z tag

## 完整流程示例

### 用户输入
```
@spec add-seo-links
@rules .rules/01-prepare-branches.md
@rules .rules/02-add-links.md
@rules .rules/03-check-quality.md
@rules .rules/04-commit-merge.md

网站收集
- 工具地址：
  - https://traffic.cv/ 看网站流量情况
  - https://query.domains/ 域名搜索
- 域名注册：
  - https://namebeta.com/zh 域名注册工具
```

### 执行流程
1. ✅ 创建稳定版本分支 `stable-v1.0`
2. ✅ 创建开发分支 `feature/add-links-20241210`
3. ✅ 添加链接到index.html
4. ✅ 检查重复链接
5. ✅ 提交更改
6. ✅ 合并到main
7. ✅ 创建release/v1.1分支
8. ✅ 打tag v1.1.0

## 规则文件说明

规则文件位于 `.rules/` 目录：

- **01-prepare-branches.md** - Git分支准备
- **02-add-links.md** - 链接添加规则
- **03-check-quality.md** - 质量检查规则
- **04-commit-merge.md** - 提交和合并规则

每个规则文件包含：
- 目标说明
- 详细执行步骤
- 验证清单
- 注意事项

## 注意事项

1. **确保工作区干净**：执行前确保没有未提交的更改
2. **链接格式**：URL必须以 `https://` 或 `http://` 开头
3. **分类选择**：根据链接功能选择合适的分类
4. **重复检查**：完全相同的URL不能重复
5. **版本号**：遵循语义化版本规范

## 常见问题

### Q: 如何只检查重复链接？
A: 单独使用质量检查规则：
```
@rules .rules/03-check-quality.md
```

### Q: 如何只添加链接不合并？
A: 只使用前三个规则：
```
@rules .rules/01-prepare-branches.md
@rules .rules/02-add-links.md
@rules .rules/03-check-quality.md
```

### Q: 如何修改现有链接？
A: 在添加链接时，如果链接已存在，会更新描述或跳过。

## 相关文件

- `.cursorrules` - Cursor命令规范
- `.rules/` - 规则文件目录
- `.seo-nav-rules.md` - 详细操作规范
- `add-seo-links.sh` - Shell脚本（可选）

