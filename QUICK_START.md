# 快速开始 - 添加SEO链接

## 最简单的方式

直接在Cursor中输入：

```
@add-seo-links
```

然后提供链接列表，例如：

```
网站收集
- 工具地址：
  - https://traffic.cv/ 看网站流量情况
  - https://query.domains/ 域名搜索
- 域名注册：
  - https://namebeta.com/zh 域名注册工具
```

## 命令会自动执行

1. ✅ 创建Git分支
2. ✅ 添加链接到index.html
3. ✅ 检查重复和质量
4. ✅ 提交并合并到main
5. ✅ 创建release分支和tag

## 其他快捷命令

### 只检查重复链接
```
@add-seo-links --check-only
```

### 只添加链接（不合并）
```
@add-seo-links --no-merge
```

## 注意事项

- 确保工作区干净（无未提交更改）
- URL必须以 `https://` 或 `http://` 开头
- 完全相同的URL不能重复

