.PHONY: help install test clean docker db mcp build

# Default target
.DEFAULT_GOAL := help

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

##@ Help

help: ## Display this help message
	@echo ""
	@echo "$(BLUE)QA Automation Platform - Available Commands$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(BLUE)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
	@echo ""

##@ Installation

install: ## Install dependencies and Playwright browsers
	@echo "$(BLUE)📦 Installing dependencies...$(NC)"
	npm install
	@echo "$(BLUE)🌐 Installing Playwright browsers...$(NC)"
	npx playwright install
	@echo "$(GREEN)✅ Installation complete!$(NC)"

install-browsers: ## Install only Playwright browsers
	@echo "$(BLUE)🌐 Installing Playwright browsers...$(NC)"
	npx playwright install
	@echo "$(GREEN)✅ Browsers installed!$(NC)"

install-chromium: ## Install only Chromium
	npx playwright install chromium

install-firefox: ## Install only Firefox
	npx playwright install firefox

install-webkit: ## Install only WebKit/Safari
	npx playwright install webkit

##@ Testing - UI Tests (9 tests)

test-ui: ## Run all UI tests on Chromium
	@echo "$(BLUE)🧪 Running UI tests on Chromium...$(NC)"
	npm run test:saucedemo-chromium

test-ui-chromium: ## Run UI tests on Chromium
	@echo "$(BLUE)🧪 Running UI tests on Chromium...$(NC)"
	npm run test:saucedemo-chromium

test-ui-firefox: ## Run UI tests on Firefox
	@echo "$(BLUE)🧪 Running UI tests on Firefox...$(NC)"
	npm run test:saucedemo-firefox

test-ui-safari: ## Run UI tests on Safari
	@echo "$(BLUE)🧪 Running UI tests on Safari...$(NC)"
	npm run test:saucedemo-safari

test-ui-all: ## Run UI tests on all browsers
	@echo "$(BLUE)🧪 Running UI tests on all browsers...$(NC)"
	make test-ui-chromium
	make test-ui-firefox
	make test-ui-safari

debug-ui: ## Debug UI tests with Playwright UI mode
	@echo "$(BLUE)🐛 Starting Playwright UI debug mode...$(NC)"
	npm run debug:saucedemo-chromium

##@ Testing - API Tests (21 tests)

test-api: ## Run API integration tests (21 tests with schema validation)
	@echo "$(BLUE)🧪 Running API tests...$(NC)"
	npm run test:api

##@ Testing - Database Tests (20 tests)

test-db: ## Run database integration tests (requires Docker)
	@echo "$(BLUE)🧪 Running database tests...$(NC)"
	@echo "$(YELLOW)⚠️  Ensure Docker is running and database is started (make db-start)$(NC)"
	npm run test:db

test-db-full: ## Start database, run tests, then stop database
	@echo "$(BLUE)🚀 Full database test workflow...$(NC)"
	make db-start
	@sleep 2
	make test-db
	make db-stop

##@ Testing - All Tests (50 tests)

test-all: ## Run all tests (UI + API + Database)
	@echo "$(BLUE)🧪 Running all 50 tests...$(NC)"
	@echo "$(YELLOW)⚠️  Ensure Docker is running for database tests$(NC)"
	npm run test:all

test: test-all ## Alias for test-all

##@ Docker Management

docker-up: ## Start all Docker services (PostgreSQL + Mock API)
	@echo "$(BLUE)🐳 Starting Docker services...$(NC)"
	npm run docker:up
	@echo "$(GREEN)✅ Docker services started!$(NC)"

docker-down: ## Stop all Docker services
	@echo "$(BLUE)🐳 Stopping Docker services...$(NC)"
	npm run docker:down
	@echo "$(GREEN)✅ Docker services stopped!$(NC)"

docker-restart: ## Restart all Docker services
	@echo "$(BLUE)🔄 Restarting Docker services...$(NC)"
	make docker-down
	make docker-up

docker-logs: ## View Docker container logs
	@echo "$(BLUE)📋 Docker logs (Ctrl+C to exit):$(NC)"
	npm run docker:logs

docker-ps: ## Show Docker container status
	@echo "$(BLUE)📊 Docker container status:$(NC)"
	docker-compose ps

docker-clean: ## Stop containers and remove volumes
	@echo "$(BLUE)🧹 Cleaning Docker resources...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✅ Docker resources cleaned!$(NC)"

##@ Database Management

db-start: ## Start PostgreSQL database only
	@echo "$(BLUE)🗄️  Starting PostgreSQL...$(NC)"
	npm run db:start

db-stop: ## Stop PostgreSQL database
	@echo "$(BLUE)🗄️  Stopping PostgreSQL...$(NC)"
	npm run db:stop

db-restart: ## Restart PostgreSQL database
	@echo "$(BLUE)🔄 Restarting PostgreSQL...$(NC)"
	make db-stop
	make db-start

db-connect: ## Connect to PostgreSQL database via psql
	@echo "$(BLUE)🔌 Connecting to PostgreSQL...$(NC)"
	npm run db:connect

db-status: ## Check PostgreSQL status
	@echo "$(BLUE)📊 PostgreSQL status:$(NC)"
	npm run db:status

db-logs: ## View PostgreSQL logs
	@echo "$(BLUE)📋 PostgreSQL logs:$(NC)"
	npm run db:logs

##@ MCP Tools (AI-Powered Test Generation)

mcp-explore: ## Explore a web page (Usage: make mcp-explore URL=https://example.com CLASS=ExamplePage)
	@if [ -z "$(URL)" ]; then \
		echo "$(RED)❌ Error: URL parameter required$(NC)"; \
		echo "$(YELLOW)Usage: make mcp-explore URL=https://example.com CLASS=ExamplePage$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(CLASS)" ]; then \
		echo "$(RED)❌ Error: CLASS parameter required$(NC)"; \
		echo "$(YELLOW)Usage: make mcp-explore URL=https://example.com CLASS=ExamplePage$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🔍 Exploring page: $(URL)$(NC)"
	./scripts/explore-page.sh $(URL) $(CLASS)

mcp-generate: ## Generate test scaffolding (Usage: make mcp-generate URL=https://example.com NAME="Test Name" FILE=output.spec.ts)
	@if [ -z "$(URL)" ]; then \
		echo "$(RED)❌ Error: URL parameter required$(NC)"; \
		echo "$(YELLOW)Usage: make mcp-generate URL=https://example.com NAME=\"Test Name\" FILE=output.spec.ts$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(NAME)" ]; then \
		echo "$(RED)❌ Error: NAME parameter required$(NC)"; \
		echo "$(YELLOW)Usage: make mcp-generate URL=https://example.com NAME=\"Test Name\" FILE=output.spec.ts$(NC)"; \
		exit 1; \
	fi
	@if [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Error: FILE parameter required$(NC)"; \
		echo "$(YELLOW)Usage: make mcp-generate URL=https://example.com NAME=\"Test Name\" FILE=output.spec.ts$(NC)"; \
		exit 1; \
	fi
	@echo "$(BLUE)🤖 Generating test for: $(URL)$(NC)"
	./scripts/generate-test.sh $(URL) $(NAME) mcp-output/$(FILE)

mcp-demo: ## Run MCP demo on saucedemo.com
	@echo "$(BLUE)🎬 Running MCP demonstration...$(NC)"
	@echo ""
	@echo "$(GREEN)1. Exploring Login Page...$(NC)"
	./scripts/explore-page.sh https://www.saucedemo.com LoginPageMCP
	@echo ""
	@echo "$(GREEN)2. Generating Login Test...$(NC)"
	./scripts/generate-test.sh https://www.saucedemo.com "Login Test Demo" mcp-output/demo-login-test.spec.ts
	@echo ""
	@echo "$(GREEN)✅ MCP demo complete! Check mcp-output/ directory$(NC)"

##@ Build & Clean

build: ## Build TypeScript to dist/
	@echo "$(BLUE)🔨 Building project...$(NC)"
	npm run build
	@echo "$(GREEN)✅ Build complete! Output in dist/$(NC)"

clean: ## Remove build artifacts
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	npm run clean
	@echo "$(GREEN)✅ Clean complete!$(NC)"

rebuild: ## Clean and rebuild
	@echo "$(BLUE)🔄 Rebuilding project...$(NC)"
	make clean
	make build

##@ Development Workflows

setup: ## Complete setup (install + docker + db)
	@echo "$(BLUE)🚀 Setting up project...$(NC)"
	make install
	make docker-up
	@echo "$(GREEN)✅ Setup complete!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  • Run all tests: $(GREEN)make test-all$(NC)"
	@echo "  • Run UI tests: $(GREEN)make test-ui$(NC)"
	@echo "  • Run API tests: $(GREEN)make test-api$(NC)"
	@echo "  • Run DB tests: $(GREEN)make test-db$(NC)"

verify: ## Verify all 50 tests pass
	@echo "$(BLUE)✅ Verifying all tests...$(NC)"
	@echo ""
	@echo "$(YELLOW)Starting database...$(NC)"
	make db-start
	@sleep 2
	@echo ""
	@echo "$(YELLOW)Running all 50 tests...$(NC)"
	make test-all
	@echo ""
	@echo "$(GREEN)✅ Verification complete!$(NC)"

quick-test: ## Quick test run (UI on Chromium only)
	@echo "$(BLUE)⚡ Quick test run...$(NC)"
	make test-ui-chromium

full-test: ## Full test suite with database setup
	@echo "$(BLUE)🎯 Full test suite...$(NC)"
	make db-start
	@sleep 2
	make test-all
	make db-stop

ci: ## CI/CD simulation (full test suite)
	@echo "$(BLUE)🔄 CI/CD simulation...$(NC)"
	make install
	make docker-up
	@sleep 3
	make test-all
	make docker-down

##@ Information

status: ## Show project status
	@echo ""
	@echo "$(BLUE)📊 QA Automation Platform Status$(NC)"
	@echo ""
	@echo "$(GREEN)Node Version:$(NC)"
	@node --version
	@echo ""
	@echo "$(GREEN)NPM Packages:$(NC)"
	@npm list --depth=0 2>/dev/null | head -10
	@echo ""
	@echo "$(GREEN)Docker Status:$(NC)"
	@docker-compose ps 2>/dev/null || echo "$(YELLOW)⚠️  Docker not running or docker-compose not initialized$(NC)"
	@echo ""
	@echo "$(GREEN)Playwright Browsers:$(NC)"
	@npx playwright --version
	@echo ""

version: ## Show version information
	@echo "$(BLUE)QA Automation Platform$(NC)"
	@echo "Version: 1.0.0"
	@echo "Author: Likhobo Mvana"
	@echo ""
	@node --version
	@npx playwright --version

##@ Git Workflow

git-status: ## Show git status
	@git status

git-log: ## Show recent commits
	@git log --oneline -10

##@ Quick Examples

example-login-test: ## Example: Run login tests only
	@echo "$(BLUE)🧪 Example: Running login tests...$(NC)"
	ENVIRONMENT=DEMO npx playwright test tests/ui/login-test.spec.ts --project=chromium

example-api-test: ## Example: Run API tests with verbose output
	@echo "$(BLUE)🧪 Example: Running API tests (verbose)...$(NC)"
	npm run test:api -- --reporter=list

example-db-test: ## Example: Run database tests with output
	@echo "$(BLUE)🧪 Example: Running database tests...$(NC)"
	make db-start
	@sleep 2
	npm run test:db -- --reporter=list
