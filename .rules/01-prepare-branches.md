# 规则1: 准备分支

## 目标
创建必要的Git分支，为添加新链接做准备。

## 执行步骤

### 1.1 检查当前状态
```bash
git status
git branch
```
- 确保工作区干净（无未提交更改）
- 确认当前分支

### 1.2 创建稳定版本分支（可选）
如果当前main分支是稳定版本，先创建稳定分支：
```bash
git checkout -b stable-v1.X
git checkout main
```
- 分支命名：`stable-v1.X`（X为当前版本号）

### 1.3 创建开发分支
从main分支创建功能开发分支：
```bash
git checkout main
git checkout -b feature/add-links-YYYYMMDD
```
- 分支命名：`feature/add-links-YYYYMMDD`（日期格式）
- 确保从最新的main分支创建

## 验证
- [ ] 当前在开发分支上
- [ ] 工作区干净
- [ ] 分支命名符合规范

## 注意事项
- 如果工作区有未提交更改，先处理或暂存
- 确保main分支是最新的（如需要先pull）

