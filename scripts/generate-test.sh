#!/bin/bash

#
# MCP Test Generator - Generate test scaffolding from a web page
# Usage: ./scripts/generate-test.sh <url> [testName] [outputPath]
#

if [ -z "$1" ]; then
  echo "❌ Error: URL required"
  echo ""
  echo "Usage:"
  echo "  ./scripts/generate-test.sh <url> [testName] [outputPath]"
  echo ""
  echo "Examples:"
  echo "  ./scripts/generate-test.sh https://www.saucedemo.com \"Login Tests\""
  echo "  ./scripts/generate-test.sh https://www.saucedemo.com \"Login Tests\" tests/generated/login.spec.ts"
  echo ""
  exit 1
fi

URL="$1"
TEST_NAME="${2:-Generated Test}"
OUTPUT_PATH="${3:-tests/generated/test.spec.ts}"

echo "🎯 Generating test with MCP..."
echo "📍 URL: $URL"
echo "📝 Test Name: $TEST_NAME"
echo "💾 Output: $OUTPUT_PATH"
echo ""

# Compile TypeScript first
npx tsc lib/mcp/mcpTestGenerator.ts --module esnext --target es2020 --moduleResolution node --outDir dist/mcp --esModuleInterop

# Run the generator
node dist/mcp/mcpTestGenerator.js "$URL" "$TEST_NAME" "$OUTPUT_PATH"
