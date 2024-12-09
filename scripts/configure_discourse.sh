#!/bin/bash
set -e

# Source environment variables
source /opt/innovation/.env

# Configure Discourse
log_info "Configuring Discourse..."

# Create configuration directory
mkdir -p /opt/innovation/docker/discourse/config

# Generate Discourse config
cat > /opt/innovation/docker/discourse/config/discourse.conf << EOF
db_pool = 25
db_timeout = 5000
hostname = "${DOMAIN}"
relative_url_root = "/forum"
serve_static_assets = true
cdn_url = ""
developer_emails = "${ADMIN_EMAIL}"
notification_email = "noreply@${DOMAIN}"
smtp_address = "${SMTP_HOST}"
smtp_port = ${SMTP_PORT}
smtp_user_name = "${SMTP_USER}"
smtp_password = "${SMTP_PASSWORD}"
smtp_enable_start_tls = true
EOF

# Set permissions
chown -R discourse:discourse /opt/innovation/docker/discourse