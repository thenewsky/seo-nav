# Cursor命令配置说明

## 配置文件

`.cursor/commands.json` - 自定义命令配置文件

## 已配置的命令

### @add-seo-links

向SEO导航站添加新链接的标准化流程。

**使用方法**：
1. 在Cursor中输入 `@add-seo-links`
2. 提供链接列表
3. 系统会自动执行完整流程

**配置信息**：
- 主规范文件：`.cursorrules`
- 规则文件目录：`.rules/`
- 相关文档：`COMMAND_GUIDE.md`, `QUICK_START.md`

## 如何让命令出现在@提示中

Cursor的`@`命令提示主要基于文件系统中的文件。为了让`@add-seo-links`出现在提示中：

1. **方法1（推荐）**：创建命令文件 `add-seo-links.md`
   - 已创建 ✅
   - 输入`@add`时，Cursor会自动提示`add-seo-links.md`

2. **方法2**：使用`.cursor/commands.json`配置
   - 已创建 ✅
   - 提供命令的元数据和规则引用

## 文件结构

```
.cursor/
├── commands.json    # 命令配置文件
└── README.md        # 本说明文件

add-seo-links.md     # 命令文件（用于@提示）
.cursorrules         # 主规范文件
.rules/              # 规则文件目录
```

## 注意事项

- Cursor可能需要重启才能识别新的命令配置
- 如果`@add-seo-links`没有出现在提示中，可以直接输入完整命令名
- 命令的实际执行逻辑在`.cursorrules`文件中定义

