#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
dist="$repo_root/.pages-dist"

rm -rf "$dist"
mkdir -p "$dist" "$dist/archive/legacy-v1" "$dist/prototypes/lowfi" "$dist/lab"

cp "$repo_root/index.html" "$repo_root/course-preview.html" "$repo_root/learn.html" "$repo_root/ai-companion.html" "$repo_root/knowledge-map.html" "$repo_root/catalog.html" "$repo_root/page-registry.json" "$dist/"
cp -R "$repo_root/assets" "$dist/assets"
cp -R "$repo_root/design-system" "$dist/design-system"
cp -R "$repo_root/docs" "$dist/docs"
cp -R "$repo_root/archive/legacy-v1/." "$dist/archive/legacy-v1/"
cp -R "$repo_root/prototypes/lowfi/." "$dist/prototypes/lowfi/"

if [[ -d "$repo_root/outputs/ux-audit" ]]; then
  cp -R "$repo_root/outputs/ux-audit" "$dist/lab/ux-audit"
fi

touch "$dist/.nojekyll"

write_redirect() {
  local old_path="$1"
  local target="$2"
  cat > "$dist/$old_path" <<HTML
<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>页面已归档</title><meta http-equiv="refresh" content="0;url=$target"><script>location.replace('$target'+location.search+location.hash)</script></head><body><p>页面已移动到 <a href="$target">$target</a>。</p></body></html>
HTML
}

write_redirect "find.html" "archive/legacy-v1/find.html"
write_redirect "paths.html" "archive/legacy-v1/paths.html"
write_redirect "detail.html" "archive/legacy-v1/detail.html"
write_redirect "courses.html" "archive/legacy-v1/courses.html"
write_redirect "training.html" "archive/legacy-v1/training.html"
write_redirect "certification.html" "archive/legacy-v1/certification.html"
write_redirect "ai-companion-lowfi.html" "prototypes/lowfi/ai-companion.html"
write_redirect "ai-companion-touchpoints-lowfi.html" "prototypes/lowfi/ai-companion-touchpoints.html"
write_redirect "knowledge-community-lowfi.html" "prototypes/lowfi/knowledge-community.html"
write_redirect "companion-wireframes.html" "prototypes/lowfi/whiteboard-ide-companion.html"

echo "GitHub Pages artifact built at $dist"
