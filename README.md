# 🚀 TCG Pokémon Arena: Vitrina de Patrones de Diseño Frontend

> Una **Aplicación de Alto Rendimiento** diseñada para demostrar arquitectura escalable, mecánicas inmersivas y excelencia visual en el ecosistema React moderno.

<p align="center">
  <!-- INSERTA AQUÍ LA IMAGEN PRINCIPAL DEL LANDING O HOME -->
  <img src="URL_IMAGEN_PRINCIPAL_AQUI" alt="Vista principal de TCG Pokémon Arena mostrando el Pokédex OS" width="800">
</p>

![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-black?style=for-the-badge&logo=framer&logoColor=blue)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

---

## 🚀 Despliegue (Live Demo)

Puedes ver la aplicación funcionando aquí: [Link a tu Vercel]

> **⚠️ Nota sobre el rendimiento:** 
> El backend de este proyecto está alojado en un plan gratuito de **Render**. 
> Debido a las políticas de "suspensión por inactividad", el servidor puede tardar entre **30 y 50 segundos** en responder tras la primera carga. 
> ¡Gracias por tu paciencia mientras el Centro Pokémon despierta! ⚡

---

## ⚔️ Duel Arena: El Motor de Combate (Highlight Principal)

<p align="center">
  <!-- INSERTA AQUÍ EL GIF O IMAGEN DEL COMBATE -->
  <img src="URL_IMAGEN_COMBATE_AQUI" alt="Interfaz de Duel Arena mostrando un combate táctico entre jugador y bot" width="800">
</p>

El corazón de la aplicación es su simulador de batallas inspirado en RPGs tácticos y TCGs.

- **Game Loop mediante Máquina de Estados (FSM):** Gestión determinista de turnos (*Player Phase* / *Enemy Phase*) garantizando un flujo de combate robusto y sin *race conditions*.
- **IA Táctica con Alta Rejugabilidad:** El Engine PVE genera dinámicamente mazos aleatorios de 6 cartas para el "Rival". El Bot evalúa su mano y toma decisiones en tiempo real sobre cuándo invocar y cuándo atacar.
- **Mapeo Dinámico de Ataques RPG:** Extracción y transformación de *stats* base (Attack, HP, Speed) desde la metadata original de los Pokémon para calcular daño, prioridades y debilidades. Transformamos un endpoint pasivo en un motor de juego vibrante.

---

## 🛠️ Architecture Insights: El "Exorcismo" de Redux

Para maximizar el rendimiento del Game Loop y la agilidad de desarrollo, se ejecutó una refactorización arquitectónica profunda: **la migración total de Redux y Redux-Thunk hacia Zustand**.

- **Zero Boilerplate:** Sustitución de *reducers*, *actions* y *dispatchers* verbosos por hooks reactivos, limpios y precisos.
- **Rendimiento Optimizado para Gaming:** Zustand permite suscribir componentes directamente a selectores específicos. Esto logra renderizados hiper-granulares y anula los re-renders globales innecesarios durante la vertiginosa cascada de interacciones en la Arena.
- **Velocity y Agilidad Mental:** Centralización de las promesas asíncronas y el control de estado en ecosistemas minimalistas (`useGameStore` y `useDeckStore`).

---

## ✨ High-Fidelity UX/UI & Features

<p align="center">
  <!-- INSERTA AQUÍ UN COLLAGE O GIF DE LA UI (Radar Chart y Modal Holográfico) -->
  <img src="URL_IMAGEN_UI_AQUI" alt="Demostración visual del Radar Chart de stats y el efecto holográfico 3D de las cartas" width="800">
</p>

- **Radar Chart Strategy:** Implementación de **Recharts** para esculpir gráficos analíticos de stats (HP, Attack, Defense, Speed), inyectando dinámicamente la paleta de colores nativa del Tipo elemental (ej. Tonos acuáticos para *Water*, Carmesí para *Fire*).
- **Hologramas 3D Premium:** Integración y tuneo avanzado de `react-parallax-tilt`. Manipulamos variables CSS inyectadas por el tracking del cursor para emular el brillo cromático (Holo foil) y la profundidad espacial de las cartas reales raras.
- **Búsqueda Intuitiva (Fuzzy Search):** Motor de *search* robusto tolerante a errores ortográficos. 
- **Pokédex OS:** Navegación persistente y fluida empotrada en un *"dashboard lateral"*, erradicando la fricción clásica del enrutamiento multi-página.

---

## 🛡️ Robustez y Resiliencia

Diseñado bajo la firme filosofía de nunca fallar de forma silenciosa.

- **Error Boundary Interceptor en Zustand:** Intercepción global a nivel Store de fallas de red de la API, mitigando de raíz el mortal *"White Screen of Death"* (WSOD).
- **Fallback UI & Retry Async:** Si la red se desploma, el ecosistema despliega un Overlay cinemático, interrumpiendo elegantemente la falla y proveyendo un botón de recuperación (*Reintento de Conexión*) que limpia la caché y re-hidrata las promesas base.

---

## � Roadmap Evolutivo

✅ **Características Clave (Completadas):** 
- Combate PVE Integral (Duel Arena).
- Oponente automatizado con Random Deck Generator de 6 slots.
- Drag & Drop interactivo para el Deck Builder.
- Filtros compuestos y multicapa.

� **Próximos Pasos (En Desarrollo):**
- 🎇 **Sistema de Partículas VFX para Ataques:** Generación geométrica de impactos y *damage numbers* flotantes al asestar golpes críticos aprovechando física Canvas.
- 🔊 **Implementación de SFX Inmersivos:** Capa acústica reactiva a las *State Transitions* (sonidos metálicos al impacto, alarmas de *"Low HP"* y música dinámica).
- 🎉 **Animaciones de Victoria con Canvas Confetti:** Explosiones de confeti direccional y celebraciones en el modal final al destrozar la alineación del bot.

---

## ⚙️ Instalación y Despliegue Local

Sigue estos pasos para clonar el proyecto, inicializar la base de datos y correr el frontend.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/pi-pokemon.git
cd pi-pokemon
```

### 2. Configuración del Backend y Base de Datos (PostgreSQL)

El proyecto requiere un Backend funcionando con una base de datos PostgreSQL conectada a través de Sequelize. Asegúrate de tener PostgreSQL instalado e inicializado.

Crea un archivo `.env` en el directorio raíz de la API (Backend) con las siguientes variables:
```env
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_password_postgres
DB_HOST=localhost
PORT=3001
```

Instala las dependencias y corre el servidor backend:
```bash
# Dentro de la carpeta de tu API/Backend
npm install
npm start
```

### 3. Ejecutar el Frontend (Vite)

Asegúrate de estar en la carpeta del cliente (`pi-pokemon`) y luego instala y corre el entorno de desarrollo HMR de Vite.
```bash
# Dentro de la carpeta del Frontend
npm install
npm run dev
```
La aplicación cliente debería arrancar en `http://localhost:5173`. ¡Disfruta la Arena!

---
*Desarrollado con arquitectura sólida, pasión por el código limpio y el rigor de un ingeniero buscando el máximo rendimiento en la UI.*
