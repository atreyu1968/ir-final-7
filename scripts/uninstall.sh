#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_DIR="/opt/innovation"

# Confirm uninstallation
read -p "This will remove all application data. Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    exit 1
fi

# Stop services
log_info "Stopping services..."
cd ${APP_DIR}
docker compose down -v

# Remove application files
log_info "Removing application files..."
cd /opt
rm -rf ${APP_DIR}

# Remove Docker images
log_info "Removing Docker images..."
docker image prune -af

log_info "Uninstallation completed successfully"