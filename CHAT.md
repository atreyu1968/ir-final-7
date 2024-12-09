# Chat Integration (Rocket.Chat)

## Overview
Real-time chat system integrated with the Innovation Network Manager platform.

## Features
- Direct messaging between users
- Group channels by department/center
- File sharing and collaboration
- Video/audio calls
- Mobile app support
- SSO integration

## Configuration
1. Access Admin Panel > Chat Configuration
2. Configure:
   - Server URL
   - Admin credentials
   - Default channel
   - SSO settings
   - Custom styling

## Docker Setup
```yaml
services:
  rocketchat:
    image: rocket.chat:latest
    environment:
      - ROOT_URL=https://redinnovacionfp.es/chat
      - MONGO_URL=mongodb://mongo:27017/rocketchat
      - MONGO_OPLOG_URL=mongodb://mongo:27017/local
    depends_on:
      - mongo
    ports:
      - "3000:3000"
```

## Usage
- Access via: https://redinnovacionfp.es/chat
- Mobile apps available for iOS/Android
- Desktop apps for Windows/Mac/Linux

## Security
- End-to-end encryption available
- SSO with platform credentials
- Role-based access control
- File sharing restrictions