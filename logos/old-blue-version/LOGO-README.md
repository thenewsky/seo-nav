# SEO导航站 Logo 使用说明

## 设计理念：Ascendant Geometry（上升几何）

这个logo基于"上升几何"的设计哲学，体现了SEO的核心价值：持续优化、排名提升、数据驱动。

### 设计特点
- **字母S**：作为SEO的首字母，以流畅的几何曲线呈现
- **上升箭头**：融入S的右上方，象征排名提升和持续优化
- **渐变配色**：从深蓝到亮青色的渐变，体现专业性和科技感
- **数据点**：右侧的连接点暗示数据分析和增长趋势
- **极简设计**：保证在各种尺寸下都清晰可辨

## 文件清单

### 矢量格式（推荐）
- `logo.svg` - 主logo文件，矢量格式，可无损缩放

### 位图格式（PNG）
- `logo-1024.png` - 超高清版本（1024×1024px）
- `logo-512.png` - 标准版本（512×512px）
- `favicon-192.png` - PWA图标（192×192px）
- `favicon-64.png` - 大favicon（64×64px）
- `favicon-48.png` - 中favicon（48×48px）
- `favicon-32.png` - 标准favicon（32×32px）
- `favicon-16.png` - 小favicon（16×16px）

## 使用方式

### 1. 作为网站favicon

在HTML `<head>` 中添加：

```html
<!-- 标准favicon -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">

<!-- 高清设备 -->
<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png">

<!-- Apple设备 -->
<link rel="apple-touch-icon" sizes="180x180" href="favicon-192.png">

<!-- SVG favicon（现代浏览器） -->
<link rel="icon" type="image/svg+xml" href="logo.svg">
```

### 2. 在页面中显示

#### 使用SVG（推荐）
```html
<img src="logo.svg" alt="SEO导航站" class="logo" width="40" height="40">
```

#### 使用PNG
```html
<img src="logo-512.png" alt="SEO导航站" class="logo" width="40" height="40">
```

#### 内联SVG
可以直接将`logo.svg`的内容复制到HTML中作为内联SVG使用。

### 3. CSS背景图

```css
.logo-bg {
  background-image: url('logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
}
```

## 颜色规范

主要使用的蓝色色系：

- **深蓝色**：`#19376D` - RGB(25, 55, 109)
- **主蓝色**：`#2980B9` - RGB(41, 128, 185)
- **亮蓝色**：`#3498DB` - RGB(52, 152, 219)
- **浅青色**：`#5DADE2` - RGB(93, 173, 226)

## 使用场景

### 最佳用途
✅ 网站favicon
✅ 页面header logo
✅ 社交媒体头像
✅ PWA应用图标
✅ 文档封面
✅ 演示文稿

### 最小尺寸
- 建议最小显示尺寸：24×24px
- 在16×16px时仍能保持识别度

## 设计文件

完整的设计哲学文档：`design-philosophy.md`

## 版权

本logo由Claude AI基于"Ascendant Geometry"设计哲学创作，专为SEO导航站项目设计。
