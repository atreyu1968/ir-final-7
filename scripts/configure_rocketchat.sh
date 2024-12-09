#!/bin/bash
set -e

# Source environment variables
source /opt/innovation/.env

# Configure Rocket.Chat
log_info "Configuring Rocket.Chat..."

# Create configuration directory
mkdir -p /opt/innovation/docker/rocketchat/config

# Generate Rocket.Chat config
cat > /opt/innovation/docker/rocketchat/config/config.yml << EOF
Site_Url: https://${DOMAIN}/chat
Organization_Type: education
Organization_Name: Red de Innovación FP
Default_Server_Language: es
Allow_Marketing_Emails: false
Show_Setup_Wizard: completed
EOF

# Set permissions
chown -R 99999:99999 /opt/innovation/docker/rocketchat