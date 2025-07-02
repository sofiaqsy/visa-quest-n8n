# Guía de Configuración Completa

## 1. Configurar Firebase

### Crear proyecto en Firebase
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto o usar existente
3. Ir a **Realtime Database** (no Firestore)
4. Crear base de datos
5. Elegir región (recomendado: us-central1)
6. Iniciar en modo prueba (luego configurar reglas)

### Obtener URL y configuración
1. La URL de tu base de datos será algo como: `https://tu-proyecto.firebaseio.com`
2. Ve a Configuración del proyecto > General
3. En "Tus apps" haz clic en "</>"
4. Registra tu app y copia la configuración

### Configurar reglas de seguridad
```json
{
  "rules": {
    "daily-phrases": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

### Generar token de autenticación
1. Ve a Configuración > Cuentas de servicio
2. Haz clic en "Database secrets" (legacy pero funciona para n8n)
3. Copia el secret token

## 2. Configurar n8n

### Instalar n8n localmente
```bash
# Con npm
npm install n8n -g
n8n start

# Con Docker
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Configurar credenciales de Firebase en n8n
1. Abrir n8n en http://localhost:5678
2. Ir a Credentials (menú lateral)
3. Crear nueva credencial
4. Buscar "HTTP Request"
5. Configurar:
   - **Name**: Firebase Auth
   - **Authentication**: Query Auth
   - **Query Parameter Name**: `auth`
   - **Query Parameter Value**: Tu secret token de Firebase

### Importar el workflow
1. En n8n, clic en "Workflows"
2. Clic en "Import from File" o "Import from URL"
3. Pegar el contenido de `workflows/daily-phrases-generator.json`
4. En el nodo "Save to Firebase":
   - Reemplazar `YOUR-PROJECT` con tu ID de proyecto
   - Seleccionar la credencial "Firebase Auth" que creaste

## 3. Modificar visa-quest para leer de Firebase

### Instalar Firebase en tu proyecto
```bash
npm install firebase
```

### Crear configuración de Firebase
```javascript
// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  databaseURL: "https://tu-proyecto.firebaseio.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "tu-app-id"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
```

### Hook para leer frases
```javascript
// src/hooks/useDailyPhrases.js
import { useState, useEffect } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

export const useDailyPhrases = (mood) => {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const phrasesRef = ref(database, `daily-phrases/${today}/phrases/${mood}`);
    
    const unsubscribe = onValue(phrasesRef, (snapshot) => {
      const data = snapshot.val();
      setPhrases(data || []);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [mood]);
  
  return { phrases, loading };
};
```

### Componente de ejemplo
```javascript
// src/components/DailyPhrases.jsx
import { useDailyPhrases } from '../hooks/useDailyPhrases';

function DailyPhrases({ userMood }) {
  const { phrases, loading } = useDailyPhrases(userMood);
  
  if (loading) return <div>Cargando frases del día...</div>;
  
  return (
    <div className="daily-phrases">
      <h3>Frases para ti hoy:</h3>
      {phrases.map((phrase, index) => (
        <div key={index} className="phrase-card">
          <p>{phrase}</p>
        </div>
      ))}
    </div>
  );
}
```

## 4. Probar el sistema

### Test manual del workflow
1. En n8n, abre el workflow
2. Clic en "Execute Workflow"
3. Verifica que se creó la entrada en Firebase

### Verificar en Firebase Console
1. Ve a tu Realtime Database
2. Deberías ver:
```
daily-phrases/
  2024-03-20/
    date: "2024-03-20"
    generatedAt: "2024-03-20T11:00:00.000Z"
    phrases/
      ansioso/
        0: "La ansiedad es temporal..."
        1: "Cada documento enviado..."
        2: "Respira profundo..."
      esperanzado/
        ...
```

## 5. Activar el workflow
1. En n8n, activa el switch "Inactive" a "Active"
2. El workflow ahora se ejecutará diariamente a las 6 AM

## Troubleshooting

### Error de autenticación en Firebase
- Verifica que el token sea correcto
- Asegúrate de que las reglas permitan escritura

### No se generan frases
- Verifica los logs en n8n (Executions)
- Revisa que el nodo Function no tenga errores de sintaxis

### La app no lee las frases
- Verifica la configuración de Firebase en tu app
- Revisa la consola del navegador para errores
- Asegúrate de que la fecha coincida