# Red de Innovación FP

Sistema de gestión para redes de innovación en formación profesional.

## Requisitos del Sistema

### Servidor
- Debian 12 (fresh install)
- 4 cores CPU mínimo
- 8GB RAM mínimo
- 50GB espacio en disco mínimo
- Conexión a Internet

## Instalación desde Cero

### 1. Actualizar Sistema
```bash
# Actualizar repositorios y paquetes
apt update && apt upgrade -y

# Instalar paquetes básicos
apt install -y curl git wget gnupg2 ca-certificates lsb-release apt-transport-https
```

### 2. Instalar Docker
```bash
# Añadir repositorio oficial de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker y Docker Compose
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 3. Configurar Firewall
```bash
# Instalar y configurar UFW
apt install -y ufw

# Configurar reglas básicas
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow http
ufw allow https

# Habilitar firewall
ufw enable
```

### 4. Clonar Repositorio
```bash
# Crear directorio de aplicación
mkdir -p /opt/innovation
cd /opt/innovation

# Clonar repositorio
git clone https://github.com/atreyu1968/ir-final-7

# Ir al directorio clonado
cd ir-final-7
```

### 5. Configurar Variables de Entorno
```bash

# Editar configuración
nano .env.production
```

Variables importantes a configurar:
- `DB_PASSWORD`: Contraseña segura para la base de datos
- `JWT_SECRET`: Token secreto para JWT
- `ADMIN_PASSWORD`: Contraseña del usuario administrador
- `DOMAIN`: Dominio de la aplicación
- `SMTP_*`: Configuración del servidor de correo

### 6. Preparar Directorios
```bash
# Crear directorios necesarios
mkdir -p secrets uploads logs backups \
        docker/{mariadb,phpmyadmin}/{conf.d,init}

# Establecer permisos
chmod -R 755 docker
chmod 600 .env.production
```

### 7. Desplegar Aplicación
```bash
# Dar permisos de ejecución al script
chmod +x deploy.sh

# Ejecutar despliegue
./deploy.sh
```

### 8. Configurar Cloudflare Tunnel
```bash
# Instalar cloudflared
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared.deb

# Autenticar con Cloudflare
cloudflared tunnel login

# Crear túnel
cloudflared tunnel create innovation-tunnel

# Configurar túnel
cat << EOF > ~/.cloudflared/config.yml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: redinnovacionfp.es
    service: http://localhost:3000
  - service: http_status:404
EOF

# Crear servicio systemd
cloudflared service install

# Iniciar servicio
systemctl start cloudflared
```

### 9. Configurar Backups
```bash
# Crear script de backup
cat << EOF > /opt/innovation/backup.sh
#!/bin/bash
/opt/innovation/docker/backup/backup.sh
EOF

# Dar permisos de ejecución
chmod +x /opt/innovation/backup.sh

# Configurar cron para backups diarios
echo "0 2 * * * /opt/innovation/backup.sh" | crontab -
```

## Actualizaciones

### 1. Backup Previo
```bash
# Realizar backup manual
./docker/backup/backup.sh
```

### 2. Actualizar Código
```bash
# Detener servicios
docker compose down

# Actualizar código
git pull origin main

# Reconstruir y reiniciar
docker compose build --no-cache
docker compose up -d
```

### 3. Verificar Actualización
```bash
# Verificar servicios
docker compose ps

# Revisar logs
docker compose logs
```

## Mantenimiento

### Logs
- Aplicación: `/opt/innovation/logs/`
- Docker: `docker compose logs`
- Sistema: `journalctl`

### Backups
- Ubicación: `/opt/innovation/backups/`
- Retención: 30 días
- Verificación: `ls -l /opt/innovation/backups/`

### Monitoreo
```bash
# Estado de servicios
docker compose ps

# Uso de recursos
docker stats

# Espacio en disco
df -h
```

### Seguridad
- Actualizaciones automáticas habilitadas
- Firewall UFW configurado
- SSL/TLS vía Cloudflare
- Backups diarios

## Integración de Servicios

### GitBook (Documentación)
- URL: https://docs.redinnovacionfp.es
- Configuración: Panel Admin > Integraciones > Documentación

### Correo Electrónico
- Configuración: Panel Admin > Configuración de Correo
- Pruebas: Usar función de test en panel

### Base de Datos
- Gestión: https://redinnovacionfp.es/phpmyadmin
- Backups: Diarios automáticos

## Soporte

### Contacto
- Email: soporte@redinnovacionfp.es
- Teléfono: +34 900 000 000

### Recursos
- Documentación: https://docs.redinnovacionfp.es
- Código fuente: https://github.com/atreyu1968/ri-final-4
- Issues: https://github.com/atreyu1968/ri-final-4/issues