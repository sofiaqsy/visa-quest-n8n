# 🚀 Desplegar n8n en Heroku - Guía Paso a Paso

## Prerrequisitos
- Cuenta en [Heroku](https://heroku.com) (gratis con límites o pago)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado
- Git instalado en tu computadora

## Opción 1: Deploy Rápido con Botón (Recomendado)

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/sofiaqsy/visa-quest-n8n)

1. Haz clic en el botón "Deploy to Heroku"
2. Completa los campos:
   - **App name**: `visa-quest-n8n` (o el nombre que prefieras)
   - **N8N_BASIC_AUTH_USER**: `admin` (o tu usuario)
   - **N8N_BASIC_AUTH_PASSWORD**: Se genera automáticamente (guárdalo!)
3. Clic en "Deploy app"
4. Espera ~5 minutos mientras se despliega

## Opción 2: Deploy Manual (Más Control)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/sofiaqsy/visa-quest-n8n.git
cd visa-quest-n8n
```

### Paso 2: Crear app en Heroku
```bash
# Login en Heroku
heroku login

# Crear la app
heroku create visa-quest-n8n

# O si el nombre está ocupado
heroku create tu-nombre-unico-n8n
```

### Paso 3: Agregar base de datos PostgreSQL
```bash
# Agregar PostgreSQL (necesario para n8n)
heroku addons:create heroku-postgresql:mini
```

### Paso 4: Configurar variables de entorno
```bash
# Autenticación básica
heroku config:set N8N_BASIC_AUTH_ACTIVE=true
heroku config:set N8N_BASIC_AUTH_USER=admin
heroku config:set N8N_BASIC_AUTH_PASSWORD=TuPasswordSeguro123

# Configuración de n8n
heroku config:set N8N_HOST=0.0.0.0
heroku config:set N8N_PORT=5678
heroku config:set N8N_PROTOCOL=https
heroku config:set NODE_ENV=production

# Timezone (importante para los cron jobs)
heroku config:set GENERIC_TIMEZONE=America/Lima

# Generar clave de encriptación
heroku config:set N8N_ENCRYPTION_KEY=$(openssl rand -base64 32)

# URL del webhook (reemplaza con tu app name)
heroku config:set WEBHOOK_URL=https://visa-quest-n8n.herokuapp.com/
```

### Paso 5: Desplegar
```bash
# Agregar Heroku como remote si no lo hiciste
heroku git:remote -a visa-quest-n8n

# Push a Heroku
git add .
git commit -m "Initial deployment"
git push heroku main
```

### Paso 6: Verificar el despliegue
```bash
# Ver logs
heroku logs --tail

# Abrir la app
heroku open
```

## 📝 Configuración Post-Deploy

### 1. Acceder a n8n
- URL: `https://tu-app-name.herokuapp.com`
- Usuario: El que configuraste en `N8N_BASIC_AUTH_USER`
- Password: El que configuraste en `N8N_BASIC_AUTH_PASSWORD`

### 2. Importar el workflow
1. En n8n, click en "Import Workflow"
2. Copia el contenido de `workflows/daily-phrases-generator.json`
3. Pégalo y guarda

### 3. Configurar credenciales de Firebase
1. En n8n, ve a Credentials (menú lateral)
2. Crear nueva credencial "HTTP Request"
3. Configurar:
   - Name: `Firebase Auth`
   - Authentication: `Query Auth`
   - Query Parameter Name: `auth`
   - Query Parameter Value: `tu-token-de-firebase`

### 4. Actualizar el workflow
1. En el nodo "Save to Firebase"
2. Reemplazar `YOUR-PROJECT` con tu ID de proyecto Firebase
3. Seleccionar la credencial "Firebase Auth"

### 5. Activar el workflow
1. Click en el switch "Inactive" → "Active"
2. El workflow ahora correrá diariamente a las 6 AM

## 🔧 Troubleshooting

### Error: "Application error"
```bash
# Ver logs detallados
heroku logs --tail --app visa-quest-n8n
```

### Error: "No web processes running"
```bash
# Escalar el dyno
heroku ps:scale web=1
```

### Error de memoria
```bash
# Ver uso de recursos
heroku ps

# Si necesitas más memoria, upgrade el dyno
heroku ps:resize web=basic
```

### n8n no guarda workflows
- Verifica que PostgreSQL esté conectado:
```bash
heroku pg:info
```

## 💰 Costos en Heroku

### Plan Eco ($5/mes)
- Dyno siempre activo
- 1000 horas de dyno
- PostgreSQL Mini incluido
- Perfecto para n8n

### Plan Basic ($7/mes)
- Más memoria (512MB)
- Mejor performance
- Recomendado si usas muchos workflows

### Plan Free (Ya no disponible)
- Heroku eliminó el plan gratuito en 2022

## 🔒 Seguridad

### Cambiar credenciales después del deploy
```bash
# Cambiar usuario
heroku config:set N8N_BASIC_AUTH_USER=nuevo-usuario

# Cambiar password
heroku config:set N8N_BASIC_AUTH_PASSWORD=NuevoPasswordMasSeguro456

# Reiniciar la app
heroku restart
```

### Backup de workflows
1. En n8n: Settings → Download Backup
2. Guarda el archivo JSON regularmente

## 🎯 Siguientes Pasos

1. **Probar el workflow manualmente**
   - En n8n, ejecuta el workflow
   - Verifica en Firebase que se crearon las frases

2. **Configurar notificaciones**
   - En n8n: Settings → Email
   - Configura alertas si falla un workflow

3. **Monitorear la app**
   ```bash
   # Instalar plugin de métricas
   heroku addons:create librato:development
   ```

## 📚 Recursos Útiles

- [Documentación de n8n](https://docs.n8n.io/)
- [Heroku Dev Center](https://devcenter.heroku.com/)
- [n8n en Docker (alternativa)](https://docs.n8n.io/hosting/installation/docker/)

¿Problemas? Abre un issue en el repositorio!