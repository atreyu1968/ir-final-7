#!/bin/bash
set -e

# Configuration
BACKUP_DIR="/backups"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
DATE=$(date +%Y%m%d_%H%M%S)
DB_CONTAINER="innovation-db"
DB_USER=${DB_USER:-"innovation_user"}
DB_NAME=${DB_NAME:-"innovation_network"}

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup database
echo "Creating database backup..."
docker exec ${DB_CONTAINER} mysqldump \
  --single-transaction \
  --quick \
  --lock-tables=false \
  -u ${DB_USER} \
  --password=${DB_PASSWORD} \
  ${DB_NAME} > ${BACKUP_DIR}/db_${DATE}.sql

# Compress backup
echo "Compressing backup..."
gzip ${BACKUP_DIR}/db_${DATE}.sql

# Backup uploaded files
echo "Backing up uploaded files..."
tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz /app/uploads

# Clean old backups
echo "Cleaning old backups..."
find ${BACKUP_DIR} -type f -mtime +${RETENTION_DAYS} -delete

echo "Backup completed successfully"