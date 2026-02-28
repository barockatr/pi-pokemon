# Vercel Production Audit Report

## 🚧 Reporte de Errores Comunes de CORS en Vercel y Solución Backend

El error más común al salir a producción no es que el backend se caiga, sino que el navegador bloquee tu frontend (alojado en `https://tu-cliente.vercel.app`) por intentar leer datos de un dominio distinto (`https://api-pokemon.railway.app`). Esto es CORS (Cross-Origin Resource Sharing).

**Síntomas en Producción:**
1. Haces F12 -> **Console**.
2. Ves un error rojo furioso: `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present`.
3. Tu pantalla entra en el "Empty State" de la Pokédex porque axios tiró un `catch`.

**Solución DevOps en el Backend (API/ExpressJS):**
Debes configurar tu servidor usando el middleware `cors` antes de definir tus rutas. Busca tu archivo principal del servidor (usualmente `app.js`, `server.js` o `index.js` en tu carpeta del backend) y añade este bloque estricto para producción:

```javascript
// En tu backend (Node/Express)
const express = require('express');
const cors = require('cors');
const app = express();

// Opciones de CORS nivel Producción
const corsOptions = {
  // Aquí debes poner LA URL EXACTA de tu frontend en Vercel
  // NO incluyas una barra (/) al final de la URL
  origin: ['https://pi-pokemon.vercel.app', 'http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Si usas cookies o sesiones
};

// Inyectar Middleware ANTES de tus rutas
app.use(cors(corsOptions));

// ... tus rutas (app.use('/pokemons', routerPokemon))
```

*Una vez actualices el backend y lo redespliegues (en Railway/Render/Fly.io), las peticiones desde el frontend en Vercel recibirán un Status 200 OK y la Arena revivirá al instante.*

---

## 🏗️ 1. Sincronización de Build (Vercel & Vite)

### Chequeo en Dashboard:
1. Asegúrate de que tu `package.json` mantenga el script original de Vite: `"build": "vite build"`.
2. En la página del proyecto de Vercel (Project > Settings > General > Build & Development):
   *   **Framework Preset:** Vite.
   *   **Build Command:** `npm run build` o `vite build`.
   *   **Output Directory:** `dist`.
3. **Manejo de Errores Linting en Build:** Por defecto Vite rompe el build si los linters fallan. Si Vercel falla al compilar (error code 1 en rojo), verifica el log. Si es un error de eslint ("`'React' is defined but never used`"), ve a tu `package.json` e ignóralos temporalmente quitando el `--max-warnings 0` de `"lint": "eslint . --ext js,jsx --report-unused-disable-directives"`.

---

## 🔗 2. Validación de la Arteria de Datos (API Connection)

### Certificación en Vivo:
1. Entra a tu app desplegada.
2. Abre la consola de DevTools (`F12`).
3. Confirma la inyección de entorno: **`[Vite Env Vercel] Inicializando Store. API Target: https://backend.railway.app`**. Si ves `http://localhost:3001` es porque no configuraste `VITE_API_URL` en las Environment Variables de Vercel antes de lanzar el deploy.
4. Pestaña **Network** > Filtro **Fetch/XHR** > recarga la página.
5. Busca el requests a `/pokemons`. Dale clic.
   *   El Status debe ser un reluciente `200 OK`.
   *   En la pestaña "Response", debes ver el JSON con el array de monstruos mezclados con nuestra lógica Fisher-Yates.

---

## 📉 3. Certificación de Rendimiento (Lighthouse Audit)

### Certificación Visual y LCP:
1. Abre tu `.vercel.app` en ventana **Incógnita** (para que las extensiones no penalicen el score).
2. DevTools (`F12`) > **Lighthouse**.
3. Elige: Mode `Navigation`, Device `Mobile`, Categories `Performance` > **Analyze page load**.
4. **Validación del LCP (Largest Contentful Paint):** Busca la métrica LCP en la parte superior. Debería estar por debajo de los **2.5 segundos** pintada de verde oscuro.
5. **Comprobación Visual del Lazy Loading:** Ve a la pestaña de `Network`, selecciona el filtro de imágenes (`Img`). Vacía la lista haciendo clic en el ícono de prohibido (clear). Ahora, empieza a hacer *scroll* agresivo por la cuadrícula de cartas. Verás cómo decenas de nuevas peticiones empiezan a poblar la lista "On Demand" solo cuando entran al *viewport*, avalando que nuestro `loading="lazy"` es infalible.
