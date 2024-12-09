# Forum Integration (Discourse)

## Overview
Discussion forum system for asynchronous communication and knowledge sharing.

## Features
- Categorized discussions
- Rich text formatting
- File attachments
- Mentions and notifications
- Topic tracking
- Search functionality

## Configuration
1. Access Admin Panel > Forum Configuration
2. Configure:
   - Server URL
   - API key
   - SSO secret
   - Default category
   - Default tags

## Docker Setup
```yaml
services:
  discourse:
    image: discourse/discourse:latest
    environment:
      - DISCOURSE_HOSTNAME=redinnovacionfp.es
      - DISCOURSE_DEVELOPER_EMAILS=admin@redinnovacionfp.es
      - DISCOURSE_SMTP_ADDRESS=smtp.gmail.com
    volumes:
      - discourse_data:/shared
    ports:
      - "80:80"
```

## Usage
- Access via: https://redinnovacionfp.es/forum
- Mobile-responsive interface
- Email notifications
- Topic subscriptions

## Security
- SSO integration
- Anti-spam measures
- Content moderation tools
- Regular security updates