#!/bin/bash
set -e

# Source environment variables
source /opt/innovation/.env

# Configure Nextcloud
log_info "Configuring Nextcloud..."

# Create configuration directory
mkdir -p /opt/innovation/docker/nextcloud/config

# Generate Nextcloud config
cat > /opt/innovation/docker/nextcloud/config/config.php << EOF
<?php
\$CONFIG = array (
  'trusted_domains' => array(
    0 => '${DOMAIN}',
    1 => 'nextcloud',
  ),
  'datadirectory' => '/var/www/html/data',
  'overwrite.cli.url' => 'https://${DOMAIN}/nextcloud',
  'htaccess.RewriteBase' => '/nextcloud',
  'default_language' => 'es',
  'default_locale' => 'es_ES',
  'default_phone_region' => 'ES',
);
EOF

# Set permissions
chown -R www-data:www-data /opt/innovation/docker/nextcloud