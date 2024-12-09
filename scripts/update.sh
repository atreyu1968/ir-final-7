#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="/opt/innovation"
BACKUP_DIR="${APP_DIR}/backups"
DATE=$(date +%Y%m%d_%H%M%S)

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

# Create backup before update
create_backup() {
    log_info "Creating backup before update..."
    
    # Create backup directory
    mkdir -p ${BACKUP_DIR}
    
    # Backup database
    log_info "Backing up database..."
    docker exec innovation-db mysqldump \
        --single-transaction \
        --quick \
        --lock-tables=false \
        -u ${DB_USER} \
        --password=${DB_PASSWORD} \
        ${DB_NAME} > ${BACKUP_DIR}/db_${DATE}.sql
    
    # Compress backup
    gzip ${BACKUP_DIR}/db_${DATE}.sql
    
    # Backup uploads
    log_info "Backing up uploads..."
    tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz ${APP_DIR}/uploads
}

# Update application code
update_code() {
    log_info "Updating application code..."
    cd ${APP_DIR}
    
    # Stash any local changes
    git stash
    
    # Pull latest changes
    git pull origin main
    
    # Install dependencies
    npm install
    
    # Build application
    npm run build
}

# Update Docker images
update_images() {
    log_info "Updating Docker images..."
    cd ${APP_DIR}
    docker compose pull
}

# Update integrations
update_integrations() {
    log_info "Checking for integration updates..."
    
    # Update Nextcloud if installed
    if [ -d "${APP_DIR}/docker/nextcloud" ]; then
        log_info "Updating Nextcloud..."
        docker compose exec -T nextcloud php occ upgrade
    fi
    
    # Update Rocket.Chat if installed
    if [ -d "${APP_DIR}/docker/rocketchat" ]; then
        log_info "Updating Rocket.Chat..."
        docker compose pull rocketchat
    fi
    
    # Update Discourse if installed
    if [ -d "${APP_DIR}/docker/discourse" ]; then
        log_info "Updating Discourse..."
        docker compose pull discourse
    fi
    
    # Update Jitsi Meet if installed
    if [ -d "${APP_DIR}/docker/jitsi" ]; then
        log_info "Updating Jitsi Meet..."
        docker compose pull jitsi-web
    fi
}

# Restart services
restart_services() {
    log_info "Restarting services..."
    cd ${APP_DIR}
    docker compose down
    docker compose up -d
    
    # Wait for services to be ready
    sleep 30
    
    # Check service status
    docker compose ps
}

# Cleanup old files and images
cleanup() {
    log_info "Cleaning up..."
    
    # Remove old backups
    find ${BACKUP_DIR} -type f -mtime +30 -delete
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused volumes
    docker volume prune -f
}

# Main update function
main() {
    log_info "Starting update process..."
    
    # Create backup
    create_backup
    
    # Update application
    update_code
    
    # Update Docker images
    update_images
    
    # Update integrations
    update_integrations
    
    # Restart services
    restart_services
    
    # Cleanup
    cleanup
    
    log_info "Update completed successfully!"
}

# Run main function
main