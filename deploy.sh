#!/bin/bash

# Production deployment guide for MailPilot using Docker
# This script helps set up MailPilot on a production server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

echo "=================================================="
echo "MailPilot Production Deployment Setup"
echo "=================================================="
echo ""

# Check if .env exists
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: .env file not found!"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "ERROR: Docker Compose is not installed!"
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✓ Docker and Docker Compose found"
echo ""

# Check disk space
AVAILABLE_SPACE=$(df "$SCRIPT_DIR" | awk 'NR==2 {print $4}')
REQUIRED_SPACE=$((20 * 1024 * 1024))  # 20GB in KB

if [ "$AVAILABLE_SPACE" -lt "$REQUIRED_SPACE" ]; then
    echo "⚠ WARNING: Less than 20GB available"
    echo "   Ollama requires ~5GB, PostgreSQL and Docker ~15GB"
    read -p "Continue anyway? (yes/no) " confirm
    if [ "$confirm" != "yes" ]; then
        exit 1
    fi
fi

echo "✓ Disk space check passed"
echo ""

# Create data directories for volumes
echo "Creating data directories..."
sudo mkdir -p /data/mailpilot/postgres
sudo mkdir -p /data/mailpilot/ollama
echo "✓ Data directories created"
echo ""

# Update docker-compose to use production config if requested
read -p "Use production configuration? (yes/no) [no] " use_prod
if [ "$use_prod" = "yes" ]; then
    echo "Using production docker-compose.prod.yml"
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

echo ""
echo "Building Docker images..."
docker-compose -f "$COMPOSE_FILE" build --pull

echo ""
echo "Starting services..."
docker-compose -f "$COMPOSE_FILE" up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

echo ""
echo "Checking service status..."
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "Running database migrations..."
docker-compose -f "$COMPOSE_FILE" exec backend npx prisma migrate deploy

echo ""
echo "Pulling Ollama model (this may take several minutes)..."
docker-compose -f "$COMPOSE_FILE" exec ollama ollama pull qwen2.5:latest

echo ""
echo "=================================================="
echo "✓ Deployment Complete!"
echo "=================================================="
echo ""
echo "Your MailPilot application is now running!"
echo ""
echo "Access points:"
echo "  Frontend: http://$(hostname -I | awk '{print $1}')/"
echo "  Backend:  http://$(hostname -I | awk '{print $1}'):3001"
echo ""
echo "Useful commands:"
echo "  View logs:      docker-compose -f $COMPOSE_FILE logs -f"
echo "  Stop services:  docker-compose -f $COMPOSE_FILE down"
echo "  Restart:        docker-compose -f $COMPOSE_FILE restart"
echo ""
echo "For detailed instructions, see:"
echo "  DOCKER_SETUP.md    - Comprehensive Docker guide"
echo "  QUICKSTART.md      - Quick reference"
echo ""
echo "Note: Keep your .env file secure and backup /data/mailpilot regularly"
echo "=================================================="
