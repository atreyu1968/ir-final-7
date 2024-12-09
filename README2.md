# Guía de Instalación Automatizada

## Instalación Rápida

1. Descargar el script de instalación:
```bash
wget https://raw.githubusercontent.com/atreyu1968/ir-final-7/main/setup.sh
```

2. Dar permisos de ejecución:
```bash
chmod +x setup.sh
```

3. Ejecutar el script:
```bash
./setup.sh
```

El script realizará automáticamente:
- Verificación de requisitos del sistema
- Instalación de dependencias (Docker, Node.js, etc.)
- Configuración del firewall
- Clonación del repositorio
- Configuración de servicios
- Despliegue de la aplicación

## Acceso al Sistema

Una vez completada la instalación:

1. Acceder a la aplicación:
   - URL: http://localhost:3000
   - Email: admin@redinnovacionfp.es
   - Contraseña: Admin2024Secure!

2. Acceder a phpMyAdmin:
   - URL: http://localhost:3000/phpmyadmin
   - Usuario: innovation_user
   - Contraseña: Prod2024Secure!

## Verificación

El sistema estará listo cuando:
- La aplicación web sea accesible
- phpMyAdmin esté funcionando
- Los servicios Docker estén activos

Para verificar el estado:
```bash
docker compose ps
```

## Mantenimiento

### Backups
Los backups se realizan automáticamente cada día a las 2 AM.
Ubicación: `/opt/innovation/backups`

### Actualizaciones
Para actualizar el sistema:
```bash
cd /opt/innovation
./scripts/update.sh
```

### Logs
- Aplicación: `/opt/innovation/logs`
- Docker: `docker compose logs`
- Sistema: `journalctl`

## Soporte

Para soporte técnico:
- Email: soporte@redinnovacionfp.es
- Teléfono: +34 900 000 000
- Horario: L-V 9:00-18:00