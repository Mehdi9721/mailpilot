#!/bin/bash

# MailPilot Docker Quick Commands
# A convenient script for common Docker operations

set -e

COMPOSE_FILE="docker-compose.yml"
COLOR_RESET='\033[0m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'

# Helper function to print colored output
print_status() {
    echo -e "${COLOR_GREEN}✓${COLOR_RESET} $1"
}

print_warning() {
    echo -e "${COLOR_YELLOW}⚠${COLOR_RESET} $1"
}

print_error() {
    echo -e "${COLOR_RED}✗${COLOR_RESET} $1"
}

# Show help
show_help() {
    cat << 'EOF'
MailPilot Docker Helper Script

Usage: ./docker-helper.sh [COMMAND]

Commands:
    start               Start all services
    stop                Stop all services
    restart             Restart all services
    logs [service]      View logs (optional service name)
    status              Show status of all services
    build               Build all services
    rebuild             Rebuild all services from scratch
    clean               Remove stopped containers
    clean-all           Remove containers and volumes (WARNING: deletes data)
    migrate             Run Prisma database migrations
    shell-backend       Open shell in backend container
    shell-postgres      Open PostgreSQL shell
    shell-ollama        Open shell in Ollama container
    setup               Initial setup (pull models, run migrations)
    help                Show this help message

Examples:
    ./docker-helper.sh start
    ./docker-helper.sh logs backend
    ./docker-helper.sh setup
EOF
}

# Start services
start_services() {
    print_status "Starting MailPilot services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    print_status "Services started!"
    
    sleep 2
    docker-compose -f "$COMPOSE_FILE" ps
}

# Stop services
stop_services() {
    print_warning "Stopping MailPilot services..."
    docker-compose -f "$COMPOSE_FILE" down
    print_status "Services stopped!"
}

# Restart services
restart_services() {
    print_warning "Restarting MailPilot services..."
    docker-compose -f "$COMPOSE_FILE" restart
    print_status "Services restarted!"
}

# View logs
view_logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker-compose -f "$COMPOSE_FILE" logs -f
    else
        docker-compose -f "$COMPOSE_FILE" logs -f "$service"
    fi
}

# Show status
show_status() {
    print_status "MailPilot Services Status:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Build services
build_services() {
    print_status "Building MailPilot services..."
    docker-compose -f "$COMPOSE_FILE" build
    print_status "Build complete!"
}

# Rebuild services
rebuild_services() {
    print_warning "Rebuilding MailPilot services (no cache)..."
    docker-compose -f "$COMPOSE_FILE" build --no-cache
    print_status "Rebuild complete!"
}

# Clean up
clean_containers() {
    print_warning "Cleaning up stopped containers..."
    docker container prune -f
    print_status "Cleanup complete!"
}

# Full cleanup
clean_all() {
    print_error "WARNING: This will delete all containers and volumes (including database)!"
    read -p "Are you sure? Type 'yes' to confirm: " confirm
    
    if [ "$confirm" = "yes" ]; then
        print_warning "Removing containers and volumes..."
        docker-compose -f "$COMPOSE_FILE" down -v
        print_status "Full cleanup complete!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Run migrations
run_migrations() {
    print_status "Running Prisma migrations..."
    docker-compose -f "$COMPOSE_FILE" exec backend npx prisma migrate deploy
    print_status "Migrations complete!"
}

# Backend shell
shell_backend() {
    print_status "Opening shell in backend container..."
    docker-compose -f "$COMPOSE_FILE" exec backend sh
}

# PostgreSQL shell
shell_postgres() {
    print_status "Opening PostgreSQL shell..."
    docker-compose -f "$COMPOSE_FILE" exec postgres psql -U postgres -d ai_mail_db
}

# Ollama shell
shell_ollama() {
    print_status "Opening shell in Ollama container..."
    docker-compose -f "$COMPOSE_FILE" exec ollama sh
}

# Initial setup
initial_setup() {
    print_status "Starting initial setup..."
    
    print_status "Step 1: Starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d
    
    sleep 5
    
    print_status "Step 2: Waiting for database to be ready..."
    sleep 10
    
    print_status "Step 3: Running database migrations..."
    docker-compose -f "$COMPOSE_FILE" exec backend npx prisma migrate deploy || print_warning "Migrations may have already been run"
    
    print_status "Step 4: Pulling Ollama model (this may take a few minutes)..."
    docker-compose -f "$COMPOSE_FILE" exec ollama ollama pull qwen2.5:latest
    
    print_status "Setup complete!"
    print_status "Services running:"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Main script logic
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        view_logs "$2"
        ;;
    status)
        show_status
        ;;
    build)
        build_services
        ;;
    rebuild)
        rebuild_services
        ;;
    clean)
        clean_containers
        ;;
    clean-all)
        clean_all
        ;;
    migrate)
        run_migrations
        ;;
    shell-backend)
        shell_backend
        ;;
    shell-postgres)
        shell_postgres
        ;;
    shell-ollama)
        shell_ollama
        ;;
    setup)
        initial_setup
        ;;
    help)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
