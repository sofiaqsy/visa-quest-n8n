# Visa Quest n8n Automation

Este proyecto contiene los workflows de n8n para automatizar la generación de frases motivacionales diarias para el proyecto [visa-quest](https://github.com/sofiaqsy/visa-quest).

## 🎯 Objetivo

Generar automáticamente frases motivacionales personalizadas según el estado de ánimo (mood) de los usuarios en proceso de visa.

## 🔧 Funcionalidades

- ⏰ Generación automática de frases diarias a las 6 AM
- 🎭 Frases personalizadas para diferentes moods (ansioso, esperanzado, frustrado, etc.)
- 🔥 Integración con Firebase para almacenamiento
- 🤖 Uso de IA para generar contenido único

## 📋 Requisitos

- n8n instalado localmente o en servidor
- Cuenta de Firebase con base de datos configurada
- (Opcional) API key de OpenAI para generación con IA

## 🚀 Despliegue en Railway

### Deploy Rápido

1. Fork este repositorio
2. Ve a [Railway](https://railway.app)
3. Conecta tu GitHub y selecciona el repositorio
4. Railway detectará automáticamente el Dockerfile
5. **IMPORTANTE**: Configura las variables de entorno (ver sección abajo)
6. Agrega PostgreSQL desde el dashboard de Railway

### Variables de Entorno Requeridas

Copia estas variables en la sección "Variables" de Railway:

```env
# Autenticación (OBLIGATORIO)
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=tu-password-seguro

# Configuración del Host (OBLIGATORIO - actualiza con tu URL de Railway)
N8N_HOST=tu-app.railway.app
N8N_PROTOCOL=https
N8N_PORT=5678
PORT=5678

# URLs (OBLIGATORIO - actualiza con tu URL de Railway)
WEBHOOK_URL=https://tu-app.railway.app/
N8N_EDITOR_BASE_URL=https://tu-app.railway.app/

# Entorno
NODE_ENV=production

# Clave de Encriptación (OBLIGATORIO - genera una clave aleatoria)
N8N_ENCRYPTION_KEY=tu-clave-aleatoria-aqui

# Zona Horaria (Opcional)
GENERIC_TIMEZONE=America/Lima
TZ=America/Lima
```

### Base de Datos

1. En Railway, haz clic en "New" → "Database" → "Add PostgreSQL"
2. Railway configurará automáticamente la variable `DATABASE_URL`

## 🚀 Instalación Local

1. Clonar este repositorio
2. Importar los workflows en n8n
3. Configurar las credenciales necesarias:
   - Firebase Database URL y Auth
   - OpenAI API Key (opcional)

## 📂 Estructura

```
├── workflows/
│   ├── daily-phrases-generator.json    # Workflow principal
│   └── mood-webhook-responder.json     # Respuesta a webhooks
├── docs/
│   └── setup-guide.md                  # Guía de configuración
└── examples/
    └── firebase-structure.json         # Estructura de datos en Firebase
```

## 🔗 Integración con visa-quest

La app visa-quest lee las frases directamente desde Firebase en:
```
/daily-phrases/{date}/phrases/{mood}
```

## 📝 Licencia

MIT
