# Deployment Guide

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development with Docker](#local-development-with-docker)
- [Production Deployment](#production-deployment)
- [GitHub Repository Setup](#github-repository-setup)
- [Security Best Practices](#security-best-practices)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Docker**: Version 20.10+
- **Docker Compose**: Version 2.0+
- **Git**: Latest version
- **GitHub Account**: For repository hosting

### Optional (for development)

- Python 3.9+
- Node.js 16+
- Code Editor (VS Code recommended)

---

## Local Development with Docker

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd senior_project
```

2. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env and add your API keys
```

3. **Build and run containers**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Docker Commands

```bash
# Start containers (detached mode)
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Run specific service
docker-compose up backend

# Scale services
docker-compose up -d --scale backend=2
```

---

## Production Deployment

### 1. Environment Setup

Create a production environment file:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your production values:
- Set `DEBUG=false`
- Configure production database (PostgreSQL recommended)
- Generate strong `SECRET_KEY`
- Add production API keys

### 2. Build Production Images

```bash
docker-compose -f docker-compose.yml build --no-cache
```

### 3. Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.yml up -d
```

### 4. Configure Reverse Proxy (Optional)

For production, use Nginx or Traefik as reverse proxy:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
    }
}
```

---

## GitHub Repository Setup

### Create New Repository

1. Go to https://github.com/new
2. Repository name: `senior-project` (or your choice)
3. Visibility: **Private** (recommended for projects with API keys)
4. Initialize with README: **No** (we already have one)
5. Click "Create repository"

### Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Senior Project AI System"

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### GitHub Secrets (for CI/CD)

Go to: Repository Settings → Secrets and variables → Actions

Add these secrets:
- `DEEPSEEK_API_KEY`: Your DeepSeek API key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `SECRET_KEY`: Production secret key
- `DOCKER_USERNAME`: Your Docker Hub username (optional)
- `DOCKER_PASSWORD`: Your Docker Hub password (optional)

---

## Security Best Practices

### ✅ DO:

- Use `.env` files for all sensitive configuration
- Add `.env` to `.gitignore` (already configured)
- Use strong, randomly generated secret keys
- Keep Docker images updated
- Run containers as non-root user (configured)
- Use HTTPS in production
- Regularly update dependencies
- Monitor logs for suspicious activity

### ❌ DON'T:

- Never commit `.env` files
- Never hardcode API keys in source code
- Never use default passwords in production
- Never run containers as root in production
- Never expose debug mode in production

### File Permissions

```bash
# Secure .env file
chmod 600 .env
chown root:root .env

# Secure docker-compose.yml
chmod 644 docker-compose.yml
```

---

## Environment Configuration

### Development (.env)

```env
DEBUG=true
LOG_LEVEL=DEBUG
DATABASE_URL=sqlite+aiosqlite:///./data/senior_project.db
```

### Production (.env.production)

```env
DEBUG=false
LOG_LEVEL=WARNING
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/senior_project
SECRET_KEY=<strong-random-key>
```

### Generate Secure Secret Key

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -base64 32
```

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Check container status
docker-compose ps

# Rebuild without cache
docker-compose build --no-cache
```

### Database Issues

```bash
# Remove and recreate database volume
docker-compose down -v
docker-compose up -d
```

### Port Already in Use

```bash
# Change port in .env
FRONTEND_PORT=3001

# Or specify in docker-compose command
docker-compose up -d --build
```

### API Connection Issues

```bash
# Check backend health
curl http://localhost:8000/health

# Check network
docker network ls
docker network inspect senior-project-network
```

### Permission Errors

```bash
# Fix Docker socket permissions (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Fix volume permissions
docker-compose down
sudo chown -R 1000:1000 ./data
docker-compose up -d
```

---

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Cleanup unused resources
docker system prune -a
```

### Backup Database

```bash
# Copy database file from container
docker cp senior-project-backend:/app/data/senior_project.db ./backup.db

# Or backup entire volume
docker run --rm -v senior-project-backend-data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

---

## Support

For issues and questions:
- Check existing issues on GitHub
- Review API documentation: http://localhost:8000/docs
- Contact: [Your Contact Information]

---

**Last Updated**: March 2026
**Version**: 1.0.0
