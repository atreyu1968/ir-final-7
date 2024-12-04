# Video Conferencing (Jitsi Meet)

## Overview
Self-hosted video conferencing solution integrated with the platform.

## Features
- HD video conferencing
- Screen sharing
- Chat during calls
- Recording capability
- Mobile support
- Calendar integration

## Configuration
1. Access Admin Panel > Video Conference Configuration
2. Configure:
   - Server URL
   - Room prefix
   - Default settings
   - Interface customization

## Docker Setup
```yaml
services:
  jitsi-meet:
    image: jitsi/web:latest
    environment:
      - ENABLE_AUTH=1
      - ENABLE_GUESTS=1
      - PUBLIC_URL=https://redinnovacionfp.es/meet
    ports:
      - "443:443"
```

## Usage
- Access via: https://redinnovacionfp.es/meet
- No software installation required
- Works in modern browsers
- Mobile apps available

## Security
- End-to-end encryption
- Room passwords
- Lobby system
- Moderator controls