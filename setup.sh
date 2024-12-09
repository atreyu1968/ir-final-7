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

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    log_error "This script must be run as root"
    exit 1
fi

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check CPU cores
    CPU_CORES=$(nproc)
    if [ "$CPU_CORES" -lt 4 ]; then
        log_warn "Minimum 4 CPU cores recommended (found: $CPU_CORES)"
    fi
    
    # Check RAM
    TOTAL_RAM=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$TOTAL_RAM" -lt 8 ]; then
        log_warn "Minimum 8GB RAM recommended (found: ${TOTAL_RAM}GB)"
    fi
    
    # Check disk space
    FREE_SPACE=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$FREE_SPACE" -lt 50 ]; then
        log_warn "Minimum 50GB free space recommended (found: ${FREE_SPACE}GB)"
    fi

    log_info "System requirements check completed"
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    # Update system
    apt update && apt upgrade -y
    
    # Install required packages
    apt install -y \
        curl \
        git \
        wget \
        gnupg2 \
        ca-certificates \
        lsb-release \
        apt-transport-https \
        dialog \
        ufw \
        fail2ban

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
        apt update
        apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        
        # Start and enable Docker service
        systemctl start docker
        systemctl enable docker
    fi

    # Install Node.js if not present
    if ! command -v node &> /dev/null; then
        log_info "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
    fi

    log_info "Dependencies installation completed"
}

# Configure firewall
configure_firewall() {
    log_info "Configuring firewall..."
    
    # Configure UFW
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow ssh
    
    # Allow HTTP/HTTPS
    ufw allow http
    ufw allow https
    
    # Allow application port
    ufw allow 3000
    
    # Enable firewall
    ufw --force enable

    log_info "Firewall configuration completed"
}

# Setup application
setup_application() {
    log_info "Setting up application..."
    
    # Create application directory
    APP_DIR="/opt/innovation"
    mkdir -p $APP_DIR
    cd $APP_DIR
    
    # Clone repository
    log_info "Cloning repository..."
    if [ -d "$APP_DIR/.git" ]; then
        git pull origin main
    else
        git clone https://github.com/atreyu1968/ir-final-7 .
    fi
    
    # Create required directories
    mkdir -p secrets uploads logs backups \
            docker/mariadb/conf.d \
            docker/mariadb/init \
            docker/phpmyadmin
    
    # Copy production environment file if it doesn't exist
    if [ ! -f "$APP_DIR/.env" ]; then
        cp .env.production .env
    fi
    
    # Set permissions
    chown -R 1000:1000 uploads logs backups
    chmod -R 755 docker uploads logs backups

    log_info "Application setup completed"
}

# Configure services
configure_services() {
    log_info "Configuring services..."
    
    APP_DIR="/opt/innovation"
    
    # Copy database configuration if it doesn't exist
    if [ ! -f "$APP_DIR/docker/mariadb/conf.d/custom.cnf" ]; then
        cp docker/mariadb/conf.d/custom.cnf docker/mariadb/conf.d/
        chmod 644 docker/mariadb/conf.d/custom.cnf
    fi

    # Configure backup cron job
    if ! crontab -l | grep -q "backup.sh"; then
        (crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/docker/backup/backup.sh") | crontab -
    fi

    log_info "Services configuration completed"
}

# Start services
start_services() {
    log_info "Starting services..."
    
    cd /opt/innovation
    
    # Pull latest images
    docker compose pull
    
    # Start services
    docker compose up -d
    
    # Wait for services to be ready
    log_info "Waiting for services to start..."
    sleep 30
    
    # Check service status
    docker compose ps

    log_info "Services started successfully"
}

# Main function
main() {
    log_info "Starting installation..."
    
    check_requirements
    install_dependencies
    configure_firewall
    setup_application
    configure_services
    start_services
    
    log_info "Installation completed successfully!"
    log_info "You can now access:"
    log_info "- Application: http://localhost:3000"
    log_info "- phpMyAdmin: http://localhost:3000/phpmyadmin"
    log_info ""
    log_info "Admin credentials:"
    log_info "Email: admin@redinnovacionfp.es"
    log_info "Password: Admin2024Secure!"
}

# Run main function
main