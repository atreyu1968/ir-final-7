# Guía de Instalación y Despliegue

Esta guía te ayudará a instalar y configurar la plataforma Red de Innovación FP paso a paso.

## 📋 Requisitos Mínimos

### Servidor
- Sistema Operativo: Debian 12 (instalación limpia)
- CPU: 4 cores mínimo
- RAM: 8GB mínimo
- Almacenamiento: 50GB mínimo
- Conexión a Internet

## 🚀 Instalación Paso a Paso

### 1. Preparación Inicial

```bash
# Acceder como root
su -

# Descargar script de instalación
wget https://raw.githubusercontent.com/atreyu1968/ir-final-7/main/install.sh

# Dar permisos de ejecución
chmod +x install.sh

# Ejecutar instalación
./install.sh
```

El script realizará automáticamente:
- Actualización del sistema
- Instalación de dependencias
- Configuración del firewall
- Instalación de Docker y Docker Compose
- Clonación del repositorio
- Configuración inicial

### 2. Configuración del Sistema

Después de la instalación inicial, accede a:
```
https://tu-dominio.com
```

Credenciales por defecto:
- Email: admin@redinnovacionfp.es
- Contraseña: Admin2024Secure!

> ⚠️ **Importante**: Cambia la contraseña inmediatamente después del primer acceso.

### 3. Panel de Administración

En el panel de administración podrás:

1. **Configurar Apariencia**
   - Logo y favicon
   - Colores del tema
   - Fuentes

2. **Gestionar Integraciones**
   - Nextcloud (almacenamiento)
   - Rocket.Chat (mensajería)
   - Discourse (foro)
   - Jitsi Meet (videoconferencias)
   - GitBook (documentación)

3. **Configurar Base de Datos**
   - Acceso a phpMyAdmin
   - Configuración de backups
   - Monitoreo de rendimiento

## 🔧 Mantenimiento

### Backups Automáticos
Los backups se realizan diariamente y se almacenan en `/opt/innovation/backups`

Para hacer un backup manual:
```bash
cd /opt/innovation
./scripts/backup.sh
```

### Actualizaciones
Para actualizar el sistema:
```bash
cd /opt/innovation
./scripts/update.sh
```

### Monitoreo
- Logs: `/opt/innovation/logs`
- Estado de servicios: `docker compose ps`
- Uso de recursos: `docker stats`

## 🔒 Seguridad

### Firewall
El firewall está configurado para permitir solo:
- SSH (puerto 22)
- HTTP (puerto 80)
- HTTPS (puerto 443)
- Puertos específicos para servicios

### SSL/TLS
Los certificados se gestionan automáticamente a través de Cloudflare.

### Backups
- Retención: 30 días
- Compresión automática
- Verificación de integridad

## 🆘 Solución de Problemas

### Servicios Caídos
```bash
# Reiniciar todos los servicios
cd /opt/innovation
docker compose restart

# Ver logs
docker compose logs
```

### Problemas de Permisos
```bash
# Corregir permisos
cd /opt/innovation
chown -R 1000:1000 uploads logs backups
chmod -R 755 docker uploads logs backups
```

### Espacio en Disco
```bash
# Limpiar Docker
docker system prune -af

# Ver uso de disco
df -h
```

## 📱 Acceso Móvil

La plataforma es completamente responsive y accesible desde:
- Navegadores móviles
- Apps nativas de las integraciones:
  - Nextcloud
  - Rocket.Chat
  - Discourse

## 🔄 Integración Continua

El sistema está configurado con GitHub Actions para:
- Tests automáticos
- Despliegue automático
- Verificación de código

## 📞 Soporte

Para soporte técnico:
- Email: soporte@redinnovacionfp.es
- Teléfono: +34 900 000 000
- Horario: L-V 9:00-18:00

## 🔍 Verificación de Instalación

Después de la instalación, verifica:

1. Acceso al panel de administración
2. Funcionamiento de las integraciones
3. Backups automáticos
4. Conexiones SSL/TLS
5. Permisos de archivos
6. Logs del sistema

## ⚡ Rendimiento

Para optimizar el rendimiento:

1. Configura el caché de Redis
2. Ajusta los límites de PHP
3. Optimiza la base de datos
4. Configura el CDN
5. Habilita la compresión gzip

## 🎯 Próximos Pasos

1. Cambiar contraseñas por defecto
2. Configurar correo electrónico
3. Personalizar la apariencia
4. Crear usuarios iniciales
5. Configurar backups externos
6. Revisar la seguridad