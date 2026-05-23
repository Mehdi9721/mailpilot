# Docker Files Summary

## Files Created

This document lists all Docker-related files created for the MailPilot project.

### Core Docker Files

1. **[apps/backend/Dockerfile](apps/backend/Dockerfile)**
   - Multi-stage build for Node.js backend
   - Compiles TypeScript, installs production dependencies
   - Uses Alpine base image for minimal size
   - Includes health checks and non-root user for security

2. **[apps/backend/.dockerignore](apps/backend/.dockerignore)**
   - Excludes unnecessary files from Docker build context
   - Reduces build time and image size

3. **[apps/dashboard/Dockerfile](apps/dashboard/Dockerfile)**
   - Multi-stage build for React/Vite frontend
   - Builds optimized production bundle
   - Serves files via Nginx
   - Includes gzip compression and caching

4. **[apps/dashboard/.dockerignore](apps/dashboard/.dockerignore)**
   - Excludes unnecessary files from build context

5. **[apps/dashboard/nginx.conf](apps/dashboard/nginx.conf)**
   - Nginx configuration for serving React SPA
   - Proxies API requests to backend
   - Includes security headers and caching rules
   - Enables gzip compression

### Docker Compose Files

6. **[docker-compose.yml](docker-compose.yml)**
   - Main Docker Compose configuration (development/staging)
   - Services: PostgreSQL, Ollama, Backend, Frontend
   - Uses bridge network for inter-service communication
   - Includes health checks and auto-restart policies

7. **[docker-compose.prod.yml](docker-compose.prod.yml)**
   - Production-ready configuration
   - Includes resource limits for all services
   - Advanced PostgreSQL configuration
   - Volume persistence configuration
   - Update strategies and proper restart policies

### Configuration Files

8. **[.env.example](.env.example)**
   - Template for environment variables
   - Copy this to `.env` and fill in your credentials
   - Contains all required variables for all services

### Documentation

9. **[DOCKER_SETUP.md](DOCKER_SETUP.md)**
   - Comprehensive Docker setup guide
   - Detailed configuration instructions
   - Troubleshooting section
   - Production considerations
   - Common commands reference

10. **[QUICKSTART.md](QUICKSTART.md)**
    - Quick reference guide
    - 5-minute setup instructions
    - Common useful commands
    - Troubleshooting tips

### Helper Scripts

11. **[docker-helper.sh](docker-helper.sh)**
    - Bash script for common Docker operations
    - Commands: start, stop, restart, logs, status, etc.
    - Colored output for easy reading
    - Interactive prompts for destructive operations

12. **[deploy.sh](deploy.sh)**
    - Production deployment setup script
    - Checks system requirements
    - Creates necessary directories
    - Runs migrations and pulls Ollama model
    - Configurable for prod/staging environments

### CI/CD

13. **[.github/workflows/docker-build.yml](.github/workflows/docker-build.yml)**
    - GitHub Actions workflow for automated builds
    - Builds and pushes Docker images on push to main/develop
    - Uses GitHub Container Registry (GHCR)
    - Includes caching for faster builds

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Docker Compose Network            │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌──────────────────┐     │
│  │  Frontend   │  │  nginx:80        │     │
│  │  (React)    │◄─┤  Serves React    │     │
│  │             │  │  Proxies /api/   │     │
│  └─────────────┘  └──────────────────┘     │
│        │                                    │
│        │ http://backend:3001                │
│        │                                    │
│        ▼                                    │
│  ┌──────────────────┐                      │
│  │  Backend         │                      │
│  │  Node.js:3001    │                      │
│  │  Express API     │                      │
│  └──────────────────┘                      │
│        │              │                    │
│        │              ▼                    │
│        │       ┌─────────────────┐        │
│        │       │  Ollama:11434   │        │
│        │       │  Qwen2.5 Model  │        │
│        │       └─────────────────┘        │
│        │                                  │
│        ▼                                  │
│  ┌──────────────────┐                    │
│  │  PostgreSQL      │                    │
│  │  postgres:5432   │                    │
│  │  ai_mail_db      │                    │
│  └──────────────────┘                    │
│                                          │
└──────────────────────────────────────────┘
```

## Quick Start

### For Development/First-Time Setup:

```bash
# Copy environment template
cp .env.example .env

# Edit with your credentials
nano .env

# Start all services
docker-compose up -d

# Initialize database
docker-compose exec backend npx prisma migrate deploy

# Pull Ollama model
docker-compose exec ollama ollama pull qwen2.5:latest

# View logs
docker-compose logs -f
```

### Using Helper Script:

```bash
# Use the convenient helper script
./docker-helper.sh setup    # Initial setup
./docker-helper.sh start    # Start services
./docker-helper.sh logs     # View logs
./docker-helper.sh stop     # Stop services
```

### For Production Deployment:

```bash
# Run the deployment script (on production server)
./deploy.sh

# Or manually:
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables

Essential variables (in `.env`):

- `DB_USER`, `DB_PASSWORD` - PostgreSQL credentials
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GOOGLE_ACCESS_TOKEN`, `GOOGLE_REFRESH_TOKEN` - Gmail tokens
- `MAIL_USER`, `MAIL_APP_PASSWORD` - Gmail account
- `OLLAMA_MODEL` - Model to use (default: qwen2.5:latest)

## Services Exposed

| Service    | Port  | URL                    | Purpose             |
| ---------- | ----- | ---------------------- | ------------------- |
| Frontend   | 80    | http://localhost       | React dashboard     |
| Backend    | 3001  | http://localhost:3001  | Express API         |
| PostgreSQL | 5432  | localhost:5432         | Database (internal) |
| Ollama     | 11434 | http://localhost:11434 | AI model (internal) |

## Important Considerations

### Security

- Never commit `.env` file to version control
- Use strong database passwords in production
- Implement SSL/TLS on frontend in production
- Keep images updated regularly

### Performance

- Ollama requires ~5GB disk space for Qwen2.5 model
- PostgreSQL needs adequate disk space for data
- Backend container uses ~200-500MB memory
- Frontend is lightweight (static files)

### Backups

- Postgres data stored in `postgres_data` volume
- Regular backups recommended: `docker run --rm -v mailpilot_postgres_data:/dbdata -v $(pwd):/backup postgres:16 pg_dump ...`
- Ollama model cache in `ollama_data` volume (can be rebuilt)

## Updating Services

```bash
# Rebuild images after code changes
docker-compose build --no-cache

# Restart all services
docker-compose up -d

# Or restart specific service
docker-compose restart backend
```

## Monitoring and Logs

```bash
# View logs for all services
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f ollama

# View last 100 lines
docker-compose logs --tail=100
```

## Troubleshooting

See `DOCKER_SETUP.md` for detailed troubleshooting section.

Common issues:

- PostgreSQL connection failures
- Ollama model not pulling
- Backend can't connect to Ollama
- Frontend can't connect to backend API
- Out of memory errors
- Port conflicts

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Ollama Documentation](https://ollama.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)

## Support

For issues or questions:

1. Check `DOCKER_SETUP.md` troubleshooting section
2. Review container logs: `docker-compose logs`
3. Verify `.env` configuration
4. Ensure Docker has sufficient resources
5. Check Docker/Docker Compose versions

---

Created: May 2026
Last Updated: May 2026
