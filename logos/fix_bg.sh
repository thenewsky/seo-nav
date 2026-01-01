#!/bin/bash
# 批量删除所有logo SVG中的白色背景

cd /Users/zhujin05/data/seo/code/seo-nav/logos

find . -name "logo.svg" -type f | while read file; do
  # 删除白色背景矩形行
  sed -i '' '/<rect width="512" height="512" fill="#FFFFFF"\/>/d' "$file"
  echo "✅ 已修复: $file"
done

echo ""
echo "🎉 所有SVG背景已改为透明！"
