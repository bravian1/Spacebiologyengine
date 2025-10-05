.PHONY: help install dev build start clean lint typecheck test genkit deploy

help:
	@echo "Available commands:"
	@echo "  make install    - Install dependencies"
	@echo "  make dev        - Start development server (port 9002)"
	@echo "  make build      - Build for production"
	@echo "  make start      - Start production server"
	@echo "  make lint       - Run ESLint"
	@echo "  make typecheck  - Run TypeScript type checking"
	@echo "  make check      - Run both lint and typecheck"
	@echo "  make genkit     - Start Genkit development server"
	@echo "  make genkit-watch - Start Genkit with hot reload"
	@echo "  make clean      - Remove build artifacts and dependencies"
	@echo "  make deploy     - Deploy to Firebase App Hosting"
	@echo "  make setup      - First-time setup (install + build)"

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm start

lint:
	npm run lint

typecheck:
	npm run typecheck

check: lint typecheck
	@echo "✓ All checks passed"

genkit:
	npm run genkit:dev

genkit-watch:
	npm run genkit:watch

clean:
	rm -rf .next node_modules .cache
	@echo "Cleaned build artifacts and dependencies"

deploy:
	npm run build
	firebase deploy

setup: install build
	@echo "✓ Setup complete. Run 'make dev' to start development server"
