#!/bin/bash

# Function to generate .env file
generate_env_file() {
    local domain="$1"
    local db_password="$2"
    local admin_email="$3"
    local admin_password="$4"
    local services="$5"
    
    cat > /opt/innovation/.env << EOF
# Application Configuration
DOMAIN=${domain}
PROTOCOL=https
NODE_ENV=production

# Database Configuration
DB_HOST=db
DB_PORT=3306
DB_USER=innovation_user
DB_PASSWORD=${db_password}
DB_NAME=innovation_network
DB_CONNECTION_LIMIT=10

# Admin Configuration
ADMIN_EMAIL=${admin_email}
ADMIN_PASSWORD=${admin_password}

# Service Installation Flags
INSTALL_NEXTCLOUD=$(echo "$services" | grep -q "nextcloud" && echo "true" || echo "false")
INSTALL_ROCKETCHAT=$(echo "$services" | grep -q "rocketchat" && echo "true" || echo "false")
INSTALL_DISCOURSE=$(echo "$services" | grep -q "discourse" && echo "true" || echo "false")
INSTALL_JITSI=$(echo "$services" | grep -q "jitsi" && echo "true" || echo "false")

# Generated Passwords
NEXTCLOUD_DB_PASSWORD=$(openssl rand -hex 16)
ROCKETCHAT_ADMIN_PASSWORD=$(openssl rand -hex 16)
DISCOURSE_DB_PASSWORD=$(openssl rand -hex 16)
DISCOURSE_ADMIN_PASSWORD=$(openssl rand -hex 16)

# Backup Configuration
BACKUP_RETENTION_DAYS=30
BACKUP_PATH=/backups
EOF
}