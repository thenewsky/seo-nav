#!/usr/bin/env python3
"""
转换 v4-dragon-horse SVG logo 到各种PNG尺寸
"""

import subprocess
import os
from pathlib import Path

# 基础路径
BASE_DIR = Path("/Users/zhujin05/data/seo/code/seo-nav/logos/v4-dragon-horse")

# 配色方案
COLORS = ["dragon-gold", "warm-orange", "orange-red", "orange-gold"]

# PNG尺寸
SIZES = {
    "logo-1024.png": 1024,
    "logo-512.png": 512,
    "favicon-192.png": 192,
    "favicon-64.png": 64,
    "favicon-32.png": 32,
    "favicon-16.png": 16,
}

def convert_svg_to_png(svg_path, png_path, size):
    """使用librsvg的rsvg-convert转换SVG到PNG"""
    try:
        cmd = [
            "rsvg-convert",
            "-w", str(size),
            "-h", str(size),
            "-f", "png",
            "-o", str(png_path),
            str(svg_path)
        ]
        subprocess.run(cmd, check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        # rsvg-convert not available, try using ImageMagick convert
        try:
            cmd = [
                "convert",
                "-background", "none",
                "-resize", f"{size}x{size}",
                str(svg_path),
                str(png_path)
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"  ⚠️  转换失败 (需要安装 librsvg 或 ImageMagick)")
            return False

def main():
    print("🎨 开始转换 v4-dragon-horse SVG 到 PNG...\n")

    total_converted = 0

    for color in COLORS:
        color_dir = BASE_DIR / color
        svg_file = color_dir / "logo.svg"

        if not svg_file.exists():
            print(f"❌ SVG文件不存在: {svg_file}")
            continue

        print(f"📁 处理 {color}/")

        for png_name, size in SIZES.items():
            png_file = color_dir / png_name

            if convert_svg_to_png(svg_file, png_file, size):
                print(f"  ✅ {png_name} ({size}x{size})")
                total_converted += 1
            else:
                print(f"  ❌ {png_name} 转换失败")

        print()

    print(f"\n🎉 完成！共转换 {total_converted} 个PNG文件")
    print(f"📊 {len(COLORS)} 个配色方案 × {len(SIZES)} 个尺寸 = {len(COLORS) * len(SIZES)} 个文件")

if __name__ == "__main__":
    main()
