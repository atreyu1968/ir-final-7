# Collaboration Space (Nextcloud)

## Overview
File sharing and collaboration platform integrated with the Innovation Network Manager.

## Features
- File storage and sharing
- Document collaboration
- Calendar integration
- Task management
- Mobile/desktop sync
- Office suite integration

## Configuration
1. Access Admin Panel > Collaboration Configuration
2. Configure:
   - Server URL
   - Admin credentials
   - Default quota
   - Default group
   - SSO settings

## Docker Setup
```yaml
services:
  nextcloud:
    image: nextcloud:latest
    environment:
      - NEXTCLOUD_ADMIN_USER=admin
      - NEXTCLOUD_ADMIN_PASSWORD=secure_password
      - POSTGRES_HOST=db
    volumes:
      - nextcloud:/var/www/html
    ports:
      - "8080:80"
```

## Usage
- Access via: https://redinnovacionfp.es/nextcloud
- Desktop sync clients available
- Mobile apps for iOS/Android
- WebDAV access

## Security
- End-to-end encryption
- SSO integration
- File access control
- Activity monitoring