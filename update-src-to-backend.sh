#!/bin/bash

# Directories to exclude
EXCLUDES="node_modules|dist|logs|scratch"

# File types to include (add more if needed)
INCLUDE_TYPES="js|ts|json|yml|yaml|sh|md|cjs|mjs"

# Find all files, filter extensions, ignore excluded dirs
find . -type f | \
  grep -E "\.($INCLUDE_TYPES)$" | \
  grep -vE "^./($EXCLUDES)/" | while read -r file; do
    perl -pi -e 's#\bsrc/#backend/#g' "$file"
done

echo "Replacement complete. Please review changes using 'git diff' before committing."