# 规则4: 提交和合并

## 目标
将更改提交到Git，合并到main分支，创建release分支和tag。

## 执行步骤

### 4.1 提交开发分支更改
```bash
cd /Users/zhujin05/data/seo/code/seo-nav
git add index.html
git commit -m "feat: 更新SEO导航站内容

- 添加 [链接名称1] ([分类])
- 添加 [链接名称2] ([分类])
- 更新 [其他改动]
- 删除重复链接: [链接名称]"
```

**提交信息规范**：
- 使用 `feat:` 前缀表示新功能
- 列出所有添加的链接
- 说明其他重要改动（如删除重复、调整分类等）

### 4.2 合并到main分支
```bash
git checkout main
git merge feature/add-links-YYYYMMDD --no-ff -m "merge: 合并新工具链接功能到main分支"
```

**注意事项**：
- 使用 `--no-ff` 保留合并历史
- 确保合并前main分支是最新的

### 4.3 创建Release分支
```bash
git checkout -b release/vX.Y
```

**版本号规则**：
- **主版本号 (X)**：重大结构调整或大量链接更新
- **次版本号 (Y)**：新增分类或中等规模更新
- **修订号 (Z)**：少量链接添加或修复

**示例**：
- 添加5个以内链接 → `v1.1.0` → `release/v1.1`
- 添加新分类 → `v1.2.0` → `release/v1.2`
- 大量更新 → `v2.0.0` → `release/v2.0`

### 4.4 打Tag
```bash
git tag -a vX.Y.Z -m "vX.Y.Z: 更新SEO导航站，添加新工具链接并优化分类"
```

**Tag命名**：
- 格式：`vX.Y.Z`
- 与release分支版本号对应
- 使用 `-a` 创建带注释的tag

### 4.5 验证
```bash
git log --oneline --graph -10
git tag -l
git branch -a
```

## 验证清单
- [ ] 开发分支已提交
- [ ] 已合并到main分支
- [ ] release分支已创建
- [ ] tag已创建
- [ ] 所有分支和tag可见

## 完整流程示例
```bash
# 1. 提交更改
git add index.html
git commit -m "feat: 添加新链接到SEO导航站"

# 2. 合并到main
git checkout main
git merge feature/add-links-20241210 --no-ff

# 3. 创建release分支
git checkout -b release/v1.1

# 4. 打tag
git tag -a v1.1.0 -m "v1.1.0: 添加新工具链接到SEO导航站"
```

## 注意事项
- 确保所有更改都已提交
- 合并前检查是否有冲突
- 版本号要遵循语义化版本规范
- Tag信息要清晰描述本次更新

