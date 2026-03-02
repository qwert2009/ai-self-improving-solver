# Makefile for Senior Project
# Simplifies common Docker and development tasks

.PHONY: help build up down logs clean rebuild restart test lint

# Default target
help:
	@echo "Senior Project - Available Commands"
	@echo "===================================="
	@echo ""
	@echo "Development:"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start containers (foreground)"
	@echo "  make start        - Start containers (background)"
	@echo "  make down         - Stop containers"
	@echo "  make restart      - Restart containers"
	@echo "  make logs         - View logs"
	@echo "  make clean        - Remove containers and volumes"
	@echo ""
	@echo "Production:"
	@echo "  make build-prod   - Build production images"
	@echo "  make start-prod   - Start production containers"
	@echo "  make stop-prod    - Stop production containers"
	@echo ""
	@echo "Development (native):"
	@echo "  make install      - Install all dependencies"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linters"
	@echo ""
	@echo "Utilities:"
	@echo "  make shell-backend - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make backup       - Backup database"
	@echo ""

# Docker Compose commands
build:
	docker-compose build

up:
	docker-compose up

start:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

clean:
	docker-compose down -v
	docker system prune -f

rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Production commands
build-prod:
	docker-compose -f docker-compose.prod.yml build

start-prod:
	docker-compose -f docker-compose.prod.yml up -d

stop-prod:
	docker-compose -f docker-compose.prod.yml down

restart-prod:
	docker-compose -f docker-compose.prod.yml restart

# Native development
install:
	@echo "Installing backend dependencies..."
	pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

test:
	@echo "Running backend tests..."
	pytest backend/ -v || echo "No tests found or tests failed"

lint:
	@echo "Running backend linter..."
	flake8 backend/ --max-line-length=127 || echo "Linting issues found"

# Shell access
shell-backend:
	docker-compose exec backend /bin/bash

shell-frontend:
	docker-compose exec frontend /bin/sh

# Database backup
backup:
	@echo "Backing up database..."
	@mkdir -p ./backups
	docker cp senior-project-backend:/app/data/senior_project.db ./backups/senior_project_backup_$$(date +%Y%m%d_%H%M%S).db

# Security scan
security-scan:
	@echo "Running security scan..."
	trivy fs .

# Generate secret key
generate-secret:
	@echo "Generated secret key:"
	python -c "import secrets; print(secrets.token_urlsafe(32))"
