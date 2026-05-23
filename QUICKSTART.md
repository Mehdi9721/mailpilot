# Quick Start Guide for MailPilot Docker

## Prerequisites

- Docker & Docker Compose installed
- `.env` file configured with your credentials

## Quick Start (5 minutes)

### 1. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your credentials
nano .env
```

### 2. Start All Services

```bash
docker-compose up -d
```

### 3. Initialize Database

```bash
docker-compose exec backend npx prisma migrate deploy
```

### 4. Pull Ollama Model

```bash
docker-compose exec ollama ollama pull qwen2.5:latest
```

### 5. Verify Everything Works

```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f

# Visit the app
# Frontend: http://localhost
# Backend: http://localhost:3001
```

## Useful Commands

```bash
# View logs for a specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Execute commands in containers
docker-compose exec backend npx prisma studio
docker-compose exec postgres psql -U postgres -d ai_mail_db

# Restart a service
docker-compose restart backend

# Stop all services
docker-compose down

# See all available commands
./docker-helper.sh help
```

## Using the Helper Script

For convenience, use the helper script:

```bash
./docker-helper.sh start          # Start services
./docker-helper.sh logs backend   # View backend logs
./docker-helper.sh setup          # Initial setup
./docker-helper.sh migrate        # Run migrations
./docker-helper.sh status         # Show status
./docker-helper.sh help           # Show all commands
```

## Troubleshooting

### Services won't start

```bash
# Check Docker is running
docker ps

# View detailed logs
docker-compose logs postgres
docker-compose logs backend
docker-compose logs ollama
```

### Can't connect to Ollama

```bash
# Verify Ollama is running
docker-compose ps ollama

# Check if model is pulled
docker-compose exec ollama ollama list

# Pull model if not present
docker-compose exec ollama ollama pull qwen2.5:latest
```

### Database connection error

```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U postgres -d ai_mail_db -c "SELECT version();"

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
docker-compose exec backend npx prisma migrate deploy
```

## Environment Variables

Required in `.env`:

- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_ACCESS_TOKEN` - Gmail access token
- `GOOGLE_REFRESH_TOKEN` - Gmail refresh token
- `MAIL_USER` - Your Gmail address
- `MAIL_APP_PASSWORD` - Gmail app password
- `DB_PASSWORD` - Strong PostgreSQL password

Optional:

- `OPENROUTER_API_KEY` - For alternative AI models
- `NODE_ENV` - Set to 'production' for production

## Ports

- Frontend: http://localhost (port 80)
- Backend: http://localhost:3001 (port 3001)
- PostgreSQL: localhost:5432
- Ollama: http://localhost:11434

## Production Deployment

For production use:

```bash
# Use production compose file with resource limits
docker-compose -f docker-compose.prod.yml up -d

# Or with environment variable
NODE_ENV=production docker-compose up -d
```

See `DOCKER_SETUP.md` for detailed documentation.
