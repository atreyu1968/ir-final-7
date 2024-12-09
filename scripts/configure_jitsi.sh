#!/bin/bash
set -e

# Source environment variables
source /opt/innovation/.env

# Configure Jitsi Meet
log_info "Configuring Jitsi Meet..."

# Create configuration directory
mkdir -p /opt/innovation/docker/jitsi/config

# Generate Jitsi Meet config
cat > /opt/innovation/docker/jitsi/config/config.js << EOF
var config = {
    hosts: {
        domain: '${DOMAIN}',
        muc: 'conference.${DOMAIN}'
    },
    bosh: '//${DOMAIN}/http-bind',
    websocket: 'wss://${DOMAIN}/xmpp-websocket',
    
    enableWelcomePage: true,
    enableClosePage: false,
    
    defaultLanguage: 'es',
    
    disableDeepLinking: true,
    
    p2p: {
        enabled: true
    },
    
    analytics: {
        disabled: true,
        rtcstatsEnabled: false
    }
};
EOF

# Set permissions
chown -R 999:999 /opt/innovation/docker/jitsi