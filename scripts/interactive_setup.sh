#!/bin/bash
set -e

# Source utility functions
source scripts/utils.sh

# Function to show dialog menu
show_menu() {
    local title="$1"
    shift
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "$title" \
           --menu "Choose an option:" 15 60 6 "$@" \
           2>&1 >/dev/tty
}

# Function to get user input
get_input() {
    local title="$1"
    local text="$2"
    local default="$3"
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "$title" \
           --inputbox "$text" 10 60 "$default" \
           2>&1 >/dev/tty
}

# Function to get password input
get_password() {
    local title="$1"
    local text="$2"
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "$title" \
           --passwordbox "$text" 10 60 \
           2>&1 >/dev/tty
}

# Function to show checklist
show_checklist() {
    local title="$1"
    shift
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "$title" \
           --checklist "Select options:" 15 60 6 "$@" \
           2>&1 >/dev/tty
}

# Main configuration function
main() {
    # Welcome message
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "Welcome" \
           --msgbox "Welcome to the Innovation Network Manager setup wizard.\n\nThis wizard will help you configure the system and its components." 10 60

    # Get domain configuration
    DOMAIN=$(get_input "Domain Configuration" "Enter your domain name:" "redinnovacionfp.es")
    
    # Get database configuration
    DB_PASSWORD=$(get_password "Database Configuration" "Enter database root password:")
    
    # Get admin configuration
    ADMIN_EMAIL=$(get_input "Admin Configuration" "Enter admin email:" "admin@${DOMAIN}")
    ADMIN_PASSWORD=$(get_password "Admin Configuration" "Enter admin password:")
    
    # Select additional services
    SERVICES=$(show_checklist "Additional Services" \
        "nextcloud" "Nextcloud File Sharing" "on" \
        "rocketchat" "Rocket.Chat Messaging" "on" \
        "discourse" "Discourse Forum" "on" \
        "jitsi" "Jitsi Meet Video Conferencing" "on")
    
    # Generate .env file
    generate_env_file "$DOMAIN" "$DB_PASSWORD" "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "$SERVICES"
    
    # Show summary
    dialog --clear --backtitle "Innovation Network Manager Setup" \
           --title "Configuration Summary" \
           --msgbox "Configuration completed!\n\nDomain: ${DOMAIN}\nAdmin Email: ${ADMIN_EMAIL}\nSelected Services: ${SERVICES}" 12 60
}

# Run main function
main