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

## 🚀 Instalación

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