#!/bin/bash

# Directories to exclude
EXCLUDES="node_modules|dist|logs|scratch"

# File types to include (add more if needed)
INCLUDE_TYPES="js|ts|json|yml|yaml|sh|md|cjs|mjs"

# Find and replace 'src/' with 'backend/' in relevant files
find . \
  -type f \
  -regextype posix-extended \
  -regex ".*\.($INCLUDE_TYPES)$" \
  ! -regex "./($EXCLUDES)/.*" \
  -print0 | while IFS= read -r -d '' file; do
    # Use perl for in-place, multi-line safe replacement
    perl -pi -e 's#\bsrc/#backend/#g' "$file"
done

echo "Replacement complete. Please review changes using 'git diff' before committing."