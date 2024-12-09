#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Utility functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check requirements
check_requirements() {
    log_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Installing Docker..."
        apt update && apt install -y docker.io
        systemctl start docker
        systemctl enable docker
    fi

    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
    fi

    log_info "All requirements are satisfied."
}

# Load environment variables
load_environment() {
    log_info "Loading environment variables..."
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        if [ -f .env.production ]; then
            log_info "Using .env.production file"
            cp .env.production .env
        else
            log_error "No .env file found"
            exit 1
        fi
    fi

    # Export all variables from .env file
    set -a
    source .env
    set +a
}

# Set up directories and permissions
setup_directories() {
    log_info "Setting up directories..."
    
    # Create necessary directories
    mkdir -p secrets uploads logs backups \
            docker/{mariadb/{conf.d,init},phpmyadmin}
    
    # Set permissions
    chmod -R 755 docker uploads logs backups
}

# Deploy application
deploy_app() {
    log_info "Deploying application..."
    
    # Pull latest images
    log_info "Pulling Docker images..."
    docker compose pull

    # Build and start containers
    log_info "Starting services..."
    docker compose up -d

    # Wait for services to be ready
    log_info "Waiting for services to be ready..."
    sleep 30
    
    # Check container status
    docker compose ps

    # Check logs for errors
    log_info "Checking service logs..."
    docker compose logs --tail=100
}

# Main function
main() {
    log_info "Starting deployment..."
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then 
        log_error "This script must be run as root"
        exit 1
    fi
    
    check_requirements
    load_environment
    setup_directories
    deploy_app
    
    log_info "Deployment completed successfully"
    
    # Show service URLs
    log_info "Services are available at:"
    echo "Main application: http://${DOMAIN}:${PORT}"
    echo "Database Admin: http://${DOMAIN}:${PORT}/phpmyadmin"
}

# Run script
main