#!/usr/bin/env bash

set -euo pipefail

SRC="${1:-content}"; SRC="${SRC%/}"
DST="${2:-public-micron}"; DST="${DST%/}"
WRITER="$(dirname "$0")/micron.lua"

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not found on PATH" >&2; exit 1
fi
if [[ ! -f "$WRITER" ]]; then
  echo "error: writer not found at $WRITER" >&2; exit 1
fi

count=0
while IFS= read -r -d '' f; do
  rel="${f#"$SRC"/}"                 # posts/hello.md
  out="$DST/${rel%.*}.mu"            # public-micron/posts/hello.mu
  mkdir -p "$(dirname "$out")"
  pandoc -f markdown -t "$WRITER" "$f" -o "$out"
  count=$((count + 1))
  echo "  micron  $rel -> ${out#"$DST"/}"
done < <(find "$SRC" -type f \( -name '*.md' -o -name '*.markdown' \) -print0)

echo "Built $count Micron page(s) into $DST/"
