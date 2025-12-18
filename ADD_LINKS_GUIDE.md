# SEO导航站 - 添加链接操作指南

## 快速开始

### 命令名称
`add-seo-links` - 标准化添加新链接到SEO导航站的工具

### 基本用法

#### 1. 检查重复链接
```bash
./add-seo-links.sh --check-duplicates
```

#### 2. 添加单个链接
```bash
./add-seo-links.sh --url "https://example.com" \
                   --name "示例工具" \
                   --category "SEO工具/关键词研究"
```

#### 3. 批量添加链接
```bash
./add-seo-links.sh --file links.txt
```

#### 4. 预览模式（不实际修改）
```bash
./add-seo-links.sh --url "https://example.com" \
                   --name "示例工具" \
                   --dry-run
```

## 完整流程

### 步骤1: 准备链接列表
创建链接文件 `links.txt`，格式如下：
```
https://example.com|示例工具|SEO工具/关键词研究
https://another.com|另一个工具|SEO工具/网站分析
```

### 步骤2: 检查重复
```bash
./add-seo-links.sh --check-duplicates
```

### 步骤3: 执行添加
```bash
./add-seo-links.sh --file links.txt
```

脚本会自动：
1. 创建功能分支 `feature/add-links-YYYYMMDD`
2. 添加链接到 `index.html`（需要手动编辑）
3. 检查重复链接
4. 提交更改
5. 合并到 `main` 分支
6. 创建 `release/vX.Y` 分支
7. 打版本tag `vX.Y.Z`

## 分类说明

### 现有分类
- **SEO社区/学习资源** - 社区论坛和学习平台
- **SEO工具/关键词研究** - 关键词挖掘和研究工具
- **SEO工具/网站分析** - 网站流量和分析工具
- **SEO工具/竞争分析** - 竞争分析和关键词难度
- **SEO教程/最佳实践** - SEO学习资源
- **域名工具** - 域名查询和注册
- **AI工具** - AI相关工具
- **开发工具** - 开发辅助工具

### 添加新分类
如果现有分类不合适，可以在 `index.html` 中创建新分类：
```html
<tr>
  <th rowspan="1">新分类名称</th>
  <td><a href="https://example.com" target="_blank">链接名称</a></td>
  <td></td>
  <td></td>
  <td></td>
</tr>
```

## 规则和注意事项

### ✅ 允许的操作
- 添加新链接到现有分类
- 创建新分类
- 更新链接显示名称
- 同一网站的不同页面（不同URL路径）

### ❌ 禁止的操作
- 完全相同的URL重复出现
- 删除已有链接（除非明确要求）
- 破坏表格结构

### 命名规范
1. **简洁明确**：使用简短的中文名称
2. **区分页面**：同一网站不同页面要区分
   - ✅ `SEO Box` 和 `SEO Box关键词`
   - ❌ 两个都叫 `SEO Box`
3. **功能标注**：工具入口可标注功能
   - ✅ `UE (Semrush/Similarweb)`
   - ✅ `提示词ROI计算器`

## 手动编辑指南

由于HTML结构复杂，脚本可能无法完全自动添加链接。需要手动编辑时：

### 1. 找到目标分类
在 `index.html` 中搜索分类名称，如：`SEO工具/关键词研究`

### 2. 找到空单元格
查找 `<td></td>` 空单元格

### 3. 添加链接
替换空单元格为：
```html
<td><a href="https://example.com" target="_blank">显示名称</a></td>
```

### 4. 如果没有空单元格
需要新增一行，并调整分类的 `rowspan` 值：
```html
<!-- 原分类 -->
<th rowspan="2">SEO工具/关键词研究</th>

<!-- 新增一行后改为 -->
<th rowspan="3">SEO工具/关键词研究</th>
```

## 版本号规则

- **主版本号 (X)**：重大结构调整（如新增多个分类）
- **次版本号 (Y)**：中等规模更新（如新增5-10个链接）
- **修订号 (Z)**：小规模更新（如新增1-3个链接）

示例：
- `v1.0.0` - 初始版本
- `v1.1.0` - 添加新分类或中等规模更新
- `v1.1.1` - 添加少量链接

## 故障排查

### 问题：发现重复链接
**解决**：运行检查命令，手动删除重复项，保留更具体的名称

### 问题：表格结构被破坏
**解决**：确保每行4个 `<td>`，检查 `rowspan` 值是否正确

### 问题：链接无法点击
**解决**：检查是否包含 `target="_blank"` 属性

## 示例场景

### 场景1: 添加单个新工具
```bash
# 1. 检查重复
./add-seo-links.sh --check-duplicates

# 2. 手动编辑 index.html 添加链接

# 3. 提交和发布
./add-seo-links.sh --url "https://newtool.com" \
                   --name "新工具" \
                   --category "SEO工具/关键词研究"
```

### 场景2: 批量添加多个链接
```bash
# 1. 准备链接文件
cat > links.txt << EOF
https://tool1.com|工具1|SEO工具/关键词研究
https://tool2.com|工具2|SEO工具/网站分析
EOF

# 2. 执行添加
./add-seo-links.sh --file links.txt
```

## 相关文件

- `.seo-nav-rules.md` - 详细规则文档
- `add-seo-links.sh` - 自动化脚本
- `links-example.txt` - 链接文件格式示例
- `index.html` - 导航站主文件

## 获取帮助

```bash
./add-seo-links.sh --help
```

