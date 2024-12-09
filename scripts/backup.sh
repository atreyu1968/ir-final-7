#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/opt/innovation/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup database
log_info "Creating database backup..."
docker exec innovation-db mysqldump \
    --single-transaction \
    --quick \
    --lock-tables=false \
    -u ${DB_USER} \
    --password=${DB_PASSWORD} \
    ${DB_NAME} > ${BACKUP_DIR}/db_${DATE}.sql

# Compress backup
log_info "Compressing backup..."
gzip ${BACKUP_DIR}/db_${DATE}.sql

# Backup uploaded files
log_info "Backing up uploaded files..."
tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz /opt/innovation/uploads

# Clean old backups
log_info "Cleaning old backups..."
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete

log_info "Backup completed successfully"