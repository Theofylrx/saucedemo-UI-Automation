#!/bin/bash

# Quick document opener for interview prep

DOCS_DIR="/Users/likhobomvana/saucedemo-UI-Automation/docs"
INTERVIEW_DIR="$DOCS_DIR/interview-prep"

case "$1" in
  quick|qr)
    open "$INTERVIEW_DIR/INTERVIEW_QUICK_REFERENCE.md"
    echo "📖 Opening: INTERVIEW_QUICK_REFERENCE.md"
    ;;
  business|bv)
    open "$INTERVIEW_DIR/BUSINESS_VALUE_GUIDE.md"
    echo "📖 Opening: BUSINESS_VALUE_GUIDE.md"
    ;;
  prep|interview)
    open "$INTERVIEW_DIR/INTERVIEW_PREP.md"
    echo "📖 Opening: INTERVIEW_PREP.md"
    ;;
  playwright|pw)
    open "$INTERVIEW_DIR/PLAYWRIGHT_VS_SELENIUM_COMPLETE.md"
    echo "📖 Opening: PLAYWRIGHT_VS_SELENIUM_COMPLETE.md"
    ;;
  improvements|improve)
    open "$INTERVIEW_DIR/PROJECT_IMPROVEMENTS_ANALYSIS.md"
    echo "📖 Opening: PROJECT_IMPROVEMENTS_ANALYSIS.md"
    ;;
  grpc|rest)
    open "$INTERVIEW_DIR/GRPC_VS_REST_GUIDE.md"
    echo "📖 Opening: GRPC_VS_REST_GUIDE.md"
    ;;
  readme|guide)
    open "$INTERVIEW_DIR/README_DOCS.md"
    echo "📖 Opening: README_DOCS.md (Master Guide)"
    ;;
  ai)
    open "$DOCS_DIR/AI_NOTES.md"
    echo "📖 Opening: AI_NOTES.md"
    ;;
  interview-folder)
    open "$INTERVIEW_DIR"
    echo "📂 Opening: docs/interview-prep/ folder"
    ;;
  all)
    open "$DOCS_DIR"
    echo "📂 Opening: docs/ folder"
    ;;
  list|ls)
    echo ""
    echo "📚 Available Documents:"
    echo "======================="
    echo ""
    echo "🔥 INTERVIEW PREP (docs/interview-prep/):"
    echo "  quick, qr         → INTERVIEW_QUICK_REFERENCE.md (30-min prep)"
    echo "  business, bv      → BUSINESS_VALUE_GUIDE.md (critical)"
    echo "  prep, interview   → INTERVIEW_PREP.md (comprehensive)"
    echo "  playwright, pw    → PLAYWRIGHT_VS_SELENIUM_COMPLETE.md"
    echo "  improvements      → PROJECT_IMPROVEMENTS_ANALYSIS.md"
    echo "  grpc, rest        → GRPC_VS_REST_GUIDE.md"
    echo "  readme, guide     → README_DOCS.md (Master Guide)"
    echo ""
    echo "📖 PROJECT DOCS (docs/):"
    echo "  ai                → AI_NOTES.md (required transparency)"
    echo ""
    echo "📂 FOLDERS:"
    echo "  interview-folder  → Open interview-prep/ folder"
    echo "  all               → Open docs/ folder"
    echo ""
    ;;
  *)
    echo "Usage: ./open-doc.sh [document]"
    echo ""
    echo "📚 Quick access to interview prep docs:"
    echo ""
    echo "  ./open-doc.sh quick       → Quick reference (30 min)"
    echo "  ./open-doc.sh business    → Business value guide"
    echo "  ./open-doc.sh prep        → Full interview prep"
    echo "  ./open-doc.sh playwright  → Playwright vs Selenium"
    echo "  ./open-doc.sh improvements → Project improvements"
    echo "  ./open-doc.sh grpc        → gRPC vs REST"
    echo "  ./open-doc.sh readme      → Master guide"
    echo "  ./open-doc.sh ai          → AI usage notes"
    echo ""
    echo "📂 Folders:"
    echo "  ./open-doc.sh interview-folder → Open interview-prep/"
    echo "  ./open-doc.sh all              → Open docs/"
    echo "  ./open-doc.sh list             → Show all options"
    echo ""
    ;;
esac
