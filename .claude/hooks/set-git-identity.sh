#!/usr/bin/env bash
set -euo pipefail

repo_dir="${CLAUDE_PROJECT_DIR:-.}"
git -C "$repo_dir" config --local user.name "charlottezhuang"
git -C "$repo_dir" config --local user.email "288195996+charlottezhuang97-jpg@users.noreply.github.com"
