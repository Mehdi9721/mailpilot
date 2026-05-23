# MailPilot Docker Setup Guide

This guide explains how to run the MailPilot project using Docker and Docker Compose on another machine.

## Project Structure

```
mailpilot/
├── docker-compose.yml       # Orchestrates all services
├── .env.example             # Environment variables template
├── apps/
│   ├── backend/             # Node.js/Express API
│   │   ├── Dockerfile       # Backend build configuration
│   │   └── .dockerignore    # Files to exclude from Docker context
│   └── dashboard/           # React/Vite frontend
│       ├── Dockerfile       # Frontend build configuration
│       ├── nginx.conf       # Nginx configuration for serving SPA
│       └── .dockerignore    # Files to exclude from Docker context
```

## Prerequisites

- **Docker** 20.10+
- **Docker Compose** 2.0+
- Environment variables configured in `.env` file

Install Docker and Docker Compose:

- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

## Services Overview

The docker-compose file orchestrates the following services:

1. **PostgreSQL (postgres)** - Database server on port 5432
2. **Ollama (ollama)** - AI model inference engine on port 11434
3. **Backend (backend)** - Express API server on port 3001
4. **Frontend (frontend)** - React dashboard (Nginx) on port 80

## Setup Instructions

### Step 1: Clone/Navigate to Project

```bash
cd mailpilot
```

### Step 2: Create Environment Configuration

Copy the example environment file and configure it with your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=ai_mail_db

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_ACCESS_TOKEN=your_access_token
GOOGLE_REFRESH_TOKEN=your_refresh_token

# Gmail Configuration
MAIL_USER=your_email@gmail.com
MAIL_APP_PASSWORD=your_app_password

# OpenRouter (optional, for alternative AI models)
OPENROUTER_API_KEY=your_api_key

# Ollama Configuration
OLLAMA_MODEL=qwen2.5:latest
OLLAMA_PORT=11434

# Server Ports
BACKEND_PORT=3001
FRONTEND_PORT=80
NODE_ENV=production
```

### Step 3: Start All Services

Build and start all services in the background:

```bash
docker-compose up -d
```

Or, to view logs while starting:

```bash
docker-compose up
```

To stop services:

```bash
docker-compose down
```

### Step 4: Initialize Database (First Run)

After starting, Prisma migrations need to run:

```bash
# Run Prisma migrations
docker-compose exec backend npx prisma migrate deploy
```

Or generate Prisma client:

```bash
docker-compose exec backend npx prisma generate
```

### Step 5: Pull Ollama Model

The first time you run the Ollama service, pull the Qwen2.5 model:

```bash
docker-compose exec ollama ollama pull qwen2.5:latest
```

This may take several minutes depending on your internet connection (model is ~5GB).

### Step 6: Verify Services are Running

```bash
# Check all services
docker-compose ps

# View logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f ollama
```

### Step 7: Access the Application

- **Frontend Dashboard**: http://localhost/
- **Backend API**: http://localhost:3001
- **Ollama API**: http://localhost:11434

## Common Commands

### View Service Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f backend
```

### Execute Commands in Containers

```bash
# Run Prisma commands
docker-compose exec backend npx prisma studio
docker-compose exec backend npx prisma migrate dev --name add_new_column

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d ai_mail_db

# Access Ollama
docker-compose exec ollama ollama list
docker-compose exec ollama ollama ps
```

### Rebuild Services

```bash
# Rebuild without cache
docker-compose build --no-cache

# Rebuild and restart
docker-compose up -d --build
```

### Clean Up

```bash
# Stop services
docker-compose down

# Remove volumes (WARNING: deletes database data)
docker-compose down -v

# Remove all unused Docker resources
docker system prune -a
```

## Troubleshooting

### Database Connection Error

If the backend can't connect to PostgreSQL:

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify DATABASE_URL in .env matches docker-compose configuration
docker-compose exec postgres psql -U postgres -d ai_mail_db
```

### Ollama Model Not Found

```bash
# List available models
docker-compose exec ollama ollama list

# Pull the model
docker-compose exec ollama ollama pull qwen2.5:latest

# Check Ollama logs
docker-compose logs ollama
```

### Backend Can't Connect to Ollama

The backend uses `http://ollama:11434` (internal Docker network). If connection fails:

```bash
# Verify Ollama is running
docker-compose logs ollama

# Test connectivity from backend
docker-compose exec backend curl http://ollama:11434/api/tags
```

### Frontend Not Connecting to Backend API

The frontend proxies API requests via Nginx configuration. Verify:

```bash
# Check nginx configuration
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Check frontend logs
docker-compose logs frontend

# Verify backend is accessible
docker-compose exec frontend wget -O- http://backend:3001/
```

### Out of Memory

If services crash due to memory constraints:

```bash
# Increase Docker Desktop memory allocation (Docker Desktop Settings)
# Or limit memory per service in docker-compose.yml:
services:
  ollama:
    mem_limit: 8gb
```

## Performance Notes

- **Ollama**: Requires significant memory (8GB+) for model inference
- **PostgreSQL**: Adequate for typical usage, can increase via environment variables
- **Backend**: Node.js, typically uses 200-500MB
- **Frontend**: Static files served by Nginx, minimal resource usage

## Production Considerations

For production deployments:

1. **Use strong database passwords** (.env should not be committed)
2. **Enable SSL/TLS** on Nginx (use Let's Encrypt)
3. **Set NODE_ENV=production** in .env
4. **Use external secrets management** (HashiCorp Vault, AWS Secrets Manager)
5. **Configure proper logging** (ELK stack, CloudWatch)
6. **Set resource limits** in docker-compose.yml
7. **Use health checks** (already configured)
8. **Regular backups** of postgres_data volume
9. **Monitor Ollama memory usage** and set appropriate limits
10. **Consider using Docker Swarm or Kubernetes** for orchestration

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data`: PostgreSQL database files
- `ollama_data`: Downloaded Ollama models

To see volumes:

```bash
docker volume ls | grep mailpilot
```

To inspect a volume:

```bash
docker volume inspect mailpilot_postgres_data
```

## Environment Variables

All services read from a single `.env` file. Key variables:

| Variable        | Default        | Description         |
| --------------- | -------------- | ------------------- |
| `DB_USER`       | postgres       | PostgreSQL username |
| `DB_PASSWORD`   | postgres       | PostgreSQL password |
| `DB_NAME`       | ai_mail_db     | Database name       |
| `DB_PORT`       | 5432           | PostgreSQL port     |
| `BACKEND_PORT`  | 3001           | Backend API port    |
| `FRONTEND_PORT` | 80             | Frontend port       |
| `NODE_ENV`      | production     | Node environment    |
| `OLLAMA_MODEL`  | qwen2.5:latest | Ollama model        |
| `OLLAMA_PORT`   | 11434          | Ollama port         |

## Networking

Services communicate via the `mailpilot-network` bridge network:

- Internal service URLs: `http://service_name:port`
- Backend to PostgreSQL: `postgresql://postgres:password@postgres:5432/ai_mail_db`
- Backend to Ollama: `http://ollama:11434`
- Frontend to Backend: Proxied via Nginx at `/api/`

## File Structure Generated by Docker

After running, the following volumes are created:

```
docker/
├── volumes/
│   ├── mailpilot_postgres_data/     # PostgreSQL data
│   └── mailpilot_ollama_data/       # Ollama models
```

## Support & Resources

- Docker Documentation: https://docs.docker.com/
- Docker Compose Reference: https://docs.docker.com/compose/
- PostgreSQL in Docker: https://hub.docker.com/_/postgres
- Ollama Documentation: https://ollama.com/
- Nginx: https://nginx.org/

## License

See main project README for license information.
