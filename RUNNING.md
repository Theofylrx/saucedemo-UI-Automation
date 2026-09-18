# 🚀 How to Run the Project

Quick reference guide for running the QA Automation Platform.

---

## ⚡ Quick Start (3 Steps)

```bash
# 1. Install dependencies
make install

# 2. Start Docker services (for database tests)
make docker-up

# 3. Run all tests
make test-all
```

**Expected Result:** 50/50 tests passing ✅

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **Docker** (for database tests)
- **npm** or **yarn**

---

## 🎯 Common Commands

### Using Make (Recommended)

```bash
# Show all available commands
make help

# Run specific test layers
make test-ui          # Run UI tests (9 tests)
make test-api         # Run API tests (21 tests)
make test-db          # Run database tests (20 tests)
make test-all         # Run all tests (50 tests)

# Debug UI tests
make debug-ui         # Opens Playwright UI mode

# Docker management
make docker-up        # Start PostgreSQL + Mock API
make docker-down      # Stop all services
make docker-logs      # View container logs

# Database management
make db-start         # Start PostgreSQL only
make db-stop          # Stop PostgreSQL
make db-connect       # Connect via psql
```

### Using NPM

```bash
# UI Tests (9 tests)
npm run test:saucedemo-chromium    # Chromium browser
npm run test:saucedemo-firefox     # Firefox browser
npm run test:saucedemo-safari      # Safari browser

# API Tests (21 tests)
npm run test:api

# Database Tests (20 tests)
npm run docker:up                  # Start database first
npm run test:db

# All Tests (50 tests)
npm run test:all
```

---

## 🧪 Test Coverage

| Layer | Tests | Description |
|-------|-------|-------------|
| **UI** | 9 tests | Login, Products, Cart, Checkout |
| **API** | 21 tests | REST API + Schema Validation |
| **Database** | 20 tests | PostgreSQL + Schema Validation |
| **Total** | **50 tests** | 100% Pass Rate ✅ |

---

## 🐳 Docker Setup

### Start All Services

```bash
make docker-up
# or
docker-compose up -d
```

**Services Started:**
- PostgreSQL (port 5432)
- Mock API (port 3000)

### Stop All Services

```bash
make docker-down
# or
docker-compose down
```

### Database Connection Info

- **Host:** localhost:5432
- **Database:** testdb
- **User:** testuser
- **Password:** testpass

---

## 🎬 Running Tests Step-by-Step

### 1. UI Tests Only (No Docker Required)

```bash
# Install browsers if not already installed
make install-browsers

# Run UI tests on Chromium
make test-ui-chromium

# Or run on all browsers
make test-ui-all
```

**Time:** ~5-8 seconds per browser
**Tests:** 9 UI tests

### 2. API Tests Only (No Docker Required)

```bash
# Run API integration tests
make test-api
```

**Time:** ~2 seconds
**Tests:** 21 API tests with schema validation

### 3. Database Tests (Requires Docker)

```bash
# Start PostgreSQL
make db-start

# Wait 2-3 seconds for database to be ready
sleep 3

# Run database tests
make test-db

# Stop PostgreSQL when done
make db-stop
```

**Time:** ~1 second (tests)
**Tests:** 20 database tests with schema validation

### 4. All Tests Together

```bash
# Complete workflow
make setup          # Install + start Docker
make verify         # Run all 50 tests

# Or manually
make install
make docker-up
sleep 3
make test-all
```

**Time:** ~10-15 seconds total
**Tests:** All 50 tests

---

## 🤖 MCP Tools (AI-Powered Test Generation)

### Explore a Web Page

```bash
# Generate Page Object from URL
make mcp-explore URL=https://www.saucedemo.com CLASS=LoginPage

# Alternative
./scripts/explore-page.sh https://www.saucedemo.com LoginPage
```

### Generate Test Scaffolding

```bash
# Generate test file
make mcp-generate URL=https://www.saucedemo.com NAME="Login Test" FILE=login.spec.ts

# Alternative
./scripts/generate-test.sh https://www.saucedemo.com "Login Test" mcp-output/login.spec.ts
```

### Run MCP Demo

```bash
# Automated demo on saucedemo.com
make mcp-demo
```

---

## 🔍 Debug Mode

### Playwright UI Mode

```bash
# Debug UI tests with visual interface
make debug-ui

# Or specify browser
npm run debug:saucedemo-chromium
npm run debug:saucedemo-firefox
npm run debug:saucedemo-safari
```

### Database Connection

```bash
# Connect to PostgreSQL via psql
make db-connect

# Inside psql:
\dt                  # List tables
SELECT * FROM users; # Query users
\q                   # Quit
```

---

## 📊 CI/CD Simulation

Simulate GitHub Actions workflow locally:

```bash
# Full CI/CD pipeline
make ci
```

**Steps:**
1. Install dependencies
2. Start Docker services
3. Run all 50 tests
4. Stop Docker services

---

## 🔧 Troubleshooting

### Tests Failing?

```bash
# 1. Check Node version
node --version   # Should be >= 18.0.0

# 2. Reinstall dependencies
make install

# 3. Check Docker status
make docker-ps

# 4. Restart Docker services
make docker-restart

# 5. View logs
make docker-logs
```

### Database Not Connecting?

```bash
# Check PostgreSQL status
make db-status

# View PostgreSQL logs
make db-logs

# Restart database
make db-restart

# Test connection
make db-connect
```

### Browsers Not Installed?

```bash
# Install all browsers
make install-browsers

# Or install individually
make install-chromium
make install-firefox
make install-webkit
```

---

## 📁 Project Structure

```
saucedemo-UI-Automation/
├── Pages/              # Page Object Models (UI layer)
├── tests/              # Test suites
│   ├── ui/            # UI tests (9 tests)
│   ├── api/           # API tests (21 tests)
│   └── database/      # Database tests (20 tests)
├── lib/               # Core frameworks
│   ├── api/           # API testing framework
│   ├── database/      # Database testing framework
│   └── mcp/           # MCP tools for AI test generation
├── docker-compose.yml # Docker services configuration
├── Makefile           # Task automation
└── package.json       # NPM scripts
```

---

## 📚 Additional Documentation

- **Detailed Guide:** `docs/QUICK_START.md`
- **AI Usage:** `docs/AI_NOTES.md`
- **Change Log:** `docs/UPDATES.md`
- **Assignment:** `README.md`

---

## ✅ Verification Checklist

Before submitting or deploying:

```bash
# Run full verification
make verify

# Or step by step:
make install          # ✅ Dependencies installed
make docker-up        # ✅ Services running
make test-ui          # ✅ 9 UI tests passing
make test-api         # ✅ 21 API tests passing
make test-db          # ✅ 20 DB tests passing
make test-all         # ✅ 50 total tests passing
```

---

## 🎯 Example Workflows

### Quick Test During Development

```bash
make quick-test      # Runs UI tests on Chromium only
```

### Full Test Before Commit

```bash
make full-test       # Runs all tests with Docker setup
```

### Clean Restart

```bash
make docker-clean    # Remove all containers and volumes
make docker-up       # Fresh start
make test-all        # Verify everything works
```

---

## 🆘 Need Help?

```bash
# Show all available commands with descriptions
make help

# Check project status
make status

# Show version information
make version
```

---

**Author:** Likhobo Mvana
**Last Updated:** January 2025
**Version:** 1.0.0

🚀 Happy Testing!
