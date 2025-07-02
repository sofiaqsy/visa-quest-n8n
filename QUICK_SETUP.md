# Instrucciones de Configuración Firebase + n8n

## 📋 Pasos Rápidos

### 1. Crear Proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Clic en "Crear proyecto"
3. Nombre: `visa-quest` (o el que prefieras)
4. Deshabilitar Google Analytics (no lo necesitas)
5. Crear proyecto

### 2. Configurar Realtime Database
1. En el menú lateral: **Build** → **Realtime Database**
2. Clic en "Create Database"
3. Elegir ubicación (usa-central1 está bien)
4. Empezar en modo de prueba
5. Una vez creada, copia la URL (ejemplo: `https://visa-quest-xxxxx.firebaseio.com`)

### 3. Obtener Credenciales para visa-quest (tu app)
1. En Firebase Console, clic en el ícono de engranaje ⚙️ → **Project settings**
2. Scroll hasta "Your apps"
3. Clic en el ícono web `</>`
4. Registrar app con nombre "visa-quest-web"
5. Copiar la configuración que aparece

### 4. Configurar visa-quest
1. En tu proyecto visa-quest, crea un archivo `.env.local`:
```env
REACT_APP_FIREBASE_API_KEY=tu-api-key-aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=visa-quest-xxxxx.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://visa-quest-xxxxx.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=visa-quest-xxxxx
REACT_APP_FIREBASE_STORAGE_BUCKET=visa-quest-xxxxx.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=tu-app-id-aqui
```

2. Reiniciar tu app: `npm start`

### 5. Obtener Token para n8n
1. En Firebase Console → Project settings → Service accounts
2. Clic en "Database secrets" (está en la parte inferior)
3. Mostrar y copiar el secret token

### 6. Configurar n8n

#### Opción A: n8n local
1. Instalar n8n: `npm install -g n8n`
2. Ejecutar: `n8n start`
3. Abrir http://localhost:5678

#### Opción B: n8n en Heroku
```bash
# En tu carpeta visa-quest-n8n
git init
heroku create tu-n8n-app
heroku config:set N8N_BASIC_AUTH_ACTIVE=true
heroku config:set N8N_BASIC_AUTH_USER=admin
heroku config:set N8N_BASIC_AUTH_PASSWORD=tu-password-seguro
git push heroku main
```

### 7. Importar Workflow en n8n
1. En n8n, clic en "Import Workflow"
2. Pegar el contenido del archivo `workflows/daily-phrases-generator.json`
3. En el nodo "Save to Firebase":
   - Reemplazar `YOUR-PROJECT` con tu ID de proyecto
   - Crear credencial HTTP Request con:
     - Authentication: Query Auth
     - Query Parameter Name: `auth`
     - Query Parameter Value: [tu token de Firebase]

### 8. Probar el Sistema
1. En n8n: Ejecutar workflow manualmente
2. En Firebase Console: Ver si se crearon los datos
3. En tu app: Las frases deberían aparecer automáticamente

## 🔧 Solución de Problemas

### Las frases no aparecen en la app
- Verifica que el workflow se ejecutó en n8n
- Revisa la consola del navegador por errores
- Confirma que las fechas coinciden (timezone)

### Error de autenticación en n8n
- Verifica que el token sea correcto
- Asegúrate de que las reglas de Firebase permitan escritura

### La app no se conecta a Firebase
- Revisa que `.env.local` tenga los valores correctos
- Reinicia la app después de cambiar `.env.local`

## 📝 Estructura de Datos en Firebase

```json
{
  "daily-phrases": {
    "2024-03-20": {
      "date": "2024-03-20",
      "generatedAt": "2024-03-20T11:00:00.000Z",
      "phrases": {
        "ansioso": ["frase1", "frase2", "frase3"],
        "esperanzado": ["frase1", "frase2", "frase3"],
        "frustrado": ["frase1", "frase2", "frase3"],
        "optimista": ["frase1", "frase2", "frase3"],
        "cansado": ["frase1", "frase2", "frase3"],
        "determinado": ["frase1", "frase2", "frase3"]
      }
    }
  }
}
```

## 🚀 Próximos Pasos

1. **Activar el workflow**: En n8n, activa el switch para que corra diariamente
2. **Agregar IA**: Reemplaza las frases predefinidas con OpenAI/Claude API
3. **Personalizar horario**: Ajusta la hora de generación según tu zona horaria

¿Necesitas ayuda? Abre un issue en el repositorio!