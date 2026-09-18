#!/bin/bash

#
# MCP Page Explorer - Explore a web page and generate Page Object
# Usage: ./scripts/explore-page.sh <url> [className]
#

if [ -z "$1" ]; then
  echo "❌ Error: URL required"
  echo ""
  echo "Usage:"
  echo "  ./scripts/explore-page.sh <url> [className]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/explore-page.sh https://www.saucedemo.com LoginPage"
  echo "  ./scripts/explore-page.sh https://www.saucedemo.com/inventory.html InventoryPage"
  echo ""
  exit 1
fi

URL="$1"
CLASS_NAME="${2:-GeneratedPage}"

echo "🔍 Exploring page with MCP..."
echo "📍 URL: $URL"
echo "📝 Page Object Class: $CLASS_NAME"
echo ""

# Compile TypeScript first
npx tsc lib/mcp/mcpPageExplorer.ts --module esnext --target es2020 --moduleResolution node --outDir dist/mcp --esModuleInterop

# Run the explorer
node dist/mcp/mcpPageExplorer.js "$URL" "$CLASS_NAME"
