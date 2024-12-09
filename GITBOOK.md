# GitBook Documentation System

## Overview
GitBook is used as the documentation system for the Red de Innovación FP platform. It provides a professional, searchable, and maintainable way to manage all system documentation.

## Features
- Markdown-based documentation
- Full-text search
- Syntax highlighting
- Multi-language support
- Version control
- API documentation
- Mobile-responsive design

## Directory Structure
```
docs/
├── book.json           # GitBook configuration
├── README.md          # Documentation home page
├── SUMMARY.md         # Documentation structure/index
├── guides/           # User guides
├── modules/          # Module documentation
├── admin/           # Administration guides
├── integration/     # Integration documentation
├── technical/       # Technical reference
├── assets/         # Images and other assets
└── styles/         # Custom CSS styles
```

## Configuration
The GitBook configuration is managed through `book.json`:

```json
{
  "title": "Red de Innovación FP",
  "description": "Documentación oficial del sistema",
  "author": "Ateca TechLab",
  "language": "es",
  "plugins": [
    "theme-default",
    "search",
    "hints",
    "copy-code-button",
    "expandable-chapters",
    "back-to-top-button"
  ]
}
```

## Docker Setup
GitBook runs in a Docker container as part of the application stack:

```yaml
gitbook:
  image: fellah/gitbook:latest
  container_name: innovation-docs
  restart: unless-stopped
  volumes:
    - ./docs:/srv/gitbook
  ports:
    - "4000:4000"
    - "35729:35729"
  environment:
    - TITLE=Red de Innovación FP
    - DESCRIPTION=Documentación del sistema
```

## Access
- Development: http://localhost:4000
- Production: https://docs.redinnovacionfp.es

## Administration
The documentation system can be managed through the admin panel:
1. Go to Admin > Documentación
2. Configure the GitBook URL and settings
3. Enable/disable the documentation system
4. Test the connection

## Writing Documentation

### File Format
All documentation is written in Markdown format:

```markdown
# Title

## Subtitle

Normal text paragraph.

- Bullet point
- Another point

1. Numbered item
2. Second item

> Note or quote

\`\`\`javascript
// Code example
const example = "code";
\`\`\`
```

### Adding Pages
1. Create new .md file in appropriate directory
2. Add entry to SUMMARY.md
3. Rebuild documentation if needed

### Style Guide
- Use H1 (#) for page titles only
- Use H2 (##) for major sections
- Use H3 (###) for subsections
- Include code examples where relevant
- Add screenshots for UI features
- Use notes for important information

## Development

### Local Setup
```bash
cd docs
npm install -g gitbook-cli
gitbook serve
```

### Building
```bash
gitbook build
```

### Adding Plugins
1. Add plugin to book.json
2. Install plugin:
```bash
gitbook install
```

## Deployment
The documentation is automatically deployed as part of the main application deployment process:

1. Documentation files are included in the Docker build
2. GitBook container starts with the application
3. Documentation is served through the platform's routing system

## Backup
Documentation is backed up along with other application data:
- Location: /backups/docs
- Frequency: Daily
- Retention: 30 days

## Security
- Access control through application authentication
- HTTPS encryption in production
- Regular security updates
- Input sanitization for search

## Support
For documentation system support:
- Technical issues: soporte@redinnovacionfp.es
- Content updates: docs@redinnovacionfp.es