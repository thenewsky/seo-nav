#!/bin/bash

# SEO导航站 - 添加新链接脚本
# 使用方法: ./add-seo-links.sh [选项]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INDEX_FILE="$REPO_DIR/index.html"
DATE=$(date +%Y%m%d)
FEATURE_BRANCH="feature/add-links-$DATE"

# 显示帮助信息
show_help() {
    cat << EOF
SEO导航站 - 添加新链接工具

用法: $0 [选项]

选项:
    --check-duplicates          检查重复链接
    --url URL                  要添加的链接URL
    --name NAME                链接显示名称
    --category CATEGORY        链接分类（可选）
    --file FILE                从文件批量添加（每行格式: URL|NAME|CATEGORY）
    --dry-run                  仅预览，不实际修改
    --help                     显示此帮助信息

示例:
    # 检查重复链接
    $0 --check-duplicates
    
    # 添加单个链接
    $0 --url "https://example.com" --name "示例工具" --category "SEO工具/关键词研究"
    
    # 从文件批量添加
    $0 --file links.txt

EOF
}

# 检查重复链接
check_duplicates() {
    echo -e "${BLUE}检查重复链接...${NC}"
    
    duplicates=$(grep -o 'href="[^"]*"' "$INDEX_FILE" | \
        sed 's/href="//;s/"$//' | \
        grep -E '^https?://' | \
        sort | uniq -c | \
        awk '$1 > 1 {print "重复" $1 "次:", $2}')
    
    if [ -z "$duplicates" ]; then
        echo -e "${GREEN}✓ 未发现重复链接${NC}"
        return 0
    else
        echo -e "${RED}✗ 发现重复链接:${NC}"
        echo "$duplicates"
        return 1
    fi
}

# 验证URL格式
validate_url() {
    local url=$1
    if [[ ! $url =~ ^https?:// ]]; then
        echo -e "${RED}错误: URL必须以 http:// 或 https:// 开头${NC}"
        return 1
    fi
    return 0
}

# 查找分类位置
find_category() {
    local category=$1
    if [ -z "$category" ]; then
        echo ""
        return
    fi
    
    # 在HTML中查找分类
    grep -n ">$category<" "$INDEX_FILE" | head -1 | cut -d: -f1
}

# 添加单个链接
add_single_link() {
    local url=$1
    local name=$2
    local category=$3
    local dry_run=$4
    
    if ! validate_url "$url"; then
        return 1
    fi
    
    # 检查是否已存在
    if grep -q "href=\"$url\"" "$INDEX_FILE"; then
        echo -e "${YELLOW}警告: 链接已存在: $url${NC}"
        return 1
    fi
    
    echo -e "${BLUE}准备添加链接:${NC}"
    echo "  URL: $url"
    echo "  名称: $name"
    echo "  分类: ${category:-未指定}"
    
    if [ "$dry_run" = "true" ]; then
        echo -e "${YELLOW}[预览模式] 不会实际修改文件${NC}"
        return 0
    fi
    
    # 这里应该调用实际的添加逻辑
    # 由于HTML结构复杂，建议手动编辑或使用更高级的工具
    echo -e "${YELLOW}注意: 自动添加功能需要手动编辑 index.html${NC}"
    echo -e "${BLUE}请按照以下格式添加:${NC}"
    echo "  <td><a href=\"$url\" target=\"_blank\">$name</a></td>"
    
    return 0
}

# 从文件批量添加
add_from_file() {
    local file=$1
    local dry_run=$2
    
    if [ ! -f "$file" ]; then
        echo -e "${RED}错误: 文件不存在: $file${NC}"
        return 1
    fi
    
    echo -e "${BLUE}从文件读取链接: $file${NC}"
    
    local count=0
    while IFS='|' read -r url name category || [ -n "$url" ]; do
        # 跳过空行和注释
        [[ -z "$url" || "$url" =~ ^# ]] && continue
        
        url=$(echo "$url" | xargs)
        name=$(echo "$name" | xargs)
        category=$(echo "$category" | xargs)
        
        if add_single_link "$url" "$name" "$category" "$dry_run"; then
            ((count++))
        fi
    done < "$file"
    
    echo -e "${GREEN}成功处理 $count 个链接${NC}"
}

# 创建开发分支
create_feature_branch() {
    echo -e "${BLUE}创建功能分支: $FEATURE_BRANCH${NC}"
    
    # 确保在main分支
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "main" ]; then
        echo -e "${YELLOW}当前不在main分支，切换到main...${NC}"
        git checkout main
    fi
    
    # 确保工作区干净
    if ! git diff-index --quiet HEAD --; then
        echo -e "${RED}错误: 工作区有未提交的更改${NC}"
        return 1
    fi
    
    git checkout -b "$FEATURE_BRANCH"
    echo -e "${GREEN}✓ 分支创建成功${NC}"
}

# 提交更改
commit_changes() {
    local message=$1
    
    if [ -z "$message" ]; then
        message="feat: 添加新链接到SEO导航站"
    fi
    
    echo -e "${BLUE}提交更改...${NC}"
    
    if ! git diff --quiet index.html; then
        git add index.html
        git commit -m "$message"
        echo -e "${GREEN}✓ 提交成功${NC}"
    else
        echo -e "${YELLOW}没有需要提交的更改${NC}"
    fi
}

# 合并到main
merge_to_main() {
    echo -e "${BLUE}合并到main分支...${NC}"
    
    git checkout main
    git merge "$FEATURE_BRANCH" --no-ff -m "merge: 合并新链接功能到main分支"
    
    echo -e "${GREEN}✓ 合并成功${NC}"
}

# 创建release分支和tag
create_release() {
    local version=$1
    
    if [ -z "$version" ]; then
        # 自动生成版本号（简化版）
        version="v1.$(date +%y%m%d)"
    fi
    
    echo -e "${BLUE}创建release分支和tag: $version${NC}"
    
    git checkout -b "release/$version"
    git tag -a "$version" -m "$version: 添加新链接到SEO导航站"
    
    echo -e "${GREEN}✓ Release创建成功${NC}"
    echo -e "${BLUE}当前在分支: release/$version${NC}"
}

# 主函数
main() {
    cd "$REPO_DIR"
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --check-duplicates)
                check_duplicates
                exit $?
                ;;
            --url)
                URL="$2"
                shift 2
                ;;
            --name)
                NAME="$2"
                shift 2
                ;;
            --category)
                CATEGORY="$2"
                shift 2
                ;;
            --file)
                FILE="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN="true"
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                echo -e "${RED}未知选项: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 执行操作
    if [ -n "$FILE" ]; then
        # 批量添加
        create_feature_branch
        add_from_file "$FILE" "${DRY_RUN:-false}"
        if [ "$DRY_RUN" != "true" ]; then
            commit_changes
            merge_to_main
            read -p "输入版本号 (如 v1.2.0，直接回车使用自动版本): " version
            create_release "$version"
        fi
    elif [ -n "$URL" ] && [ -n "$NAME" ]; then
        # 单个添加
        create_feature_branch
        add_single_link "$URL" "$NAME" "$CATEGORY" "${DRY_RUN:-false}"
        if [ "$DRY_RUN" != "true" ]; then
            commit_changes
            merge_to_main
            read -p "输入版本号 (如 v1.2.0，直接回车使用自动版本): " version
            create_release "$version"
        fi
    else
        echo -e "${YELLOW}请指定要执行的操作${NC}"
        show_help
        exit 1
    fi
}

# 运行主函数
main "$@"

