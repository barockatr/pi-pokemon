# 🌀 PI Pokémon
> Aplicación web interactiva tipo enciclopedia para explorar, buscar y crear nuevos Pokémon utilizando datos de la PokéAPI y una base de datos propia.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## 🔗 Enlaces Rápidos
- [🚀 Live Demo / Deploy](#) <!-- Reemplazar con URL si aplica -->
- [📹 Video Tour del Proyecto](#) <!-- Reemplazar con URL si aplica -->

---

## 📸 Vistazo Rápido

![Vista Principal](./docs/dashboard.png)
*Interfaz principal mostrando el listado de Pokémon y opciones de filtrado (Actualiza con la imagen real)*

![Funcionalidad Clave](./docs/feature.png)
*Vista detallada de las estadísticas y atributos de un Pokémon (Actualiza con la imagen real)*

---

## 🎯 ¿De qué trata?
**PI Pokémon** resuelve la necesidad de contar con una "Pokédex" centralizada e interactiva bajo el principio de Componentes Basados en Átomos, lo que permite actualizaciones modulares (como el sistema evolutivo o mejoras de combate) sin afectar la integridad del sistema central. Es un MVP (Producto Mínimo Viable) diseñado para el crecimiento continuo.

Implementé un Landing Page minimalista basado en Call-to-Action (CTA) temático. La entrada a la aplicación está centralizada en un componente interactivo (Pokébola) que actúa como disparador de la experiencia, utilizando transiciones de estado para una navegación fluida hacia el dashboard principal.

---

## ✨ Características Clave
- **Gamificación de la UI e Interactividad**: El uso de la Pokébola como entrada es "gamificar" la interfaz para invitar al usuario a la experiencia.
- **Dashboard Aleatorio y Dinámico**: El Dashboard principal cuenta con un renderizado dinámico de datos aleatorios obtenidos de la API, diseñado para ofrecer una vista fresca en cada sesión. Se utiliza lógica de shuffling (mezclado) en el frontend para presentar una diversidad de tipos y regiones desde el primer contacto.
- **UX Intuitiva con Filtros Avanzados**: Que todo sirva (filtros, búsquedas) sin recargar la página. El Dashboard integra un sistema de filtrado multivariable y búsqueda predictiva que no interrumpe la fluidez visual, manteniendo consistencia estética en toda la interfaz.
- **Arquitectura Escalable y Enrutamiento Modular**: La arquitectura cuenta con un enrutamiento que separa la zona de exploración del módulo pedagógico (Tutorial TCG). Hoy es un dashboard y mañana es un juego completo de combate.
- **🃏 Visualizador TCG Dinámico**: Transformación de datos crudos en una interfaz de carta coleccionable fiel al formato clásico, con cálculo automático de daños, HP y costes de retirada.

---

## 🛠️ Stack Tecnológico
- **Frontend Core / Backend Core**: React 18 / Node.js
- **State Management**: Redux y Redux Thunk
- **Enrutamiento / API**: React Router v6 / Express
- **Base de Datos / Data Fetching**: PostgreSQL (Sequelize ORM) / Axios
- **Estilos**: Vanilla CSS / CSS Modules

---

## 🚀 Guía de Instalación (Getting Started)

Sigue estos pasos para correr el proyecto en tu entorno local:

```bash
# 1. Clonar el repositorio
git clone https://github.com/barockatr/pi-pokemon.git

# 2. Navegar al directorio del proyecto
cd pi-pokemon-1

# 3. Instalar las dependencias (Frontend y Backend)
cd pi-pokemon
npm install

cd ../PI-Pokemon-main/api
npm install

# 4. Configurar variables de entorno y Base de Datos
# En la carpeta PI-Pokemon-main/api, renombra/crea el archivo .env y configura tus credenciales:
# DB_USER=tu_usuario_postgres
# DB_PASSWORD=tu_password
# DB_HOST=localhost
# IMPORTANTE: Crear la base de datos "pokemon" en tu motor de PostgreSQL.

# 5. Iniciar el servidor backend (Desde la carpeta PI-Pokemon-main/api)
npm start

# 6. Iniciar el servidor de desarrollo UI (Desde la carpeta pi-pokemon)
npm run dev
```

---

## 🏗️ Arquitectura y Estructura del Proyecto

El proyecto sigue una arquitectura Full-Stack estricta, separando el cliente del servidor para garantizar escalabilidad y un código limpio:

- **Backend (`/api`)**: API RESTful construida con Node.js y Express. Utiliza un patrón de controladores y enrutamiento modularizado. La persistencia y modelado de datos se manejan a través del ORM Sequelize conectado a PostgreSQL.
- **Frontend (`/client` o `/pi-pokemon`)**: SPA (Single Page Application) desarrollada con React. La estructura jerarquiza componentes reutilizables de UI (`/components`), vistas lógicas (`/views`) y gestión de peticiones.
- **State Management (`/redux`)**: Centralización del estado global para evitar el anti-patrón de *prop drilling* y mantener sincronizada la paginación y los filtros en toda la app.

---

## 🧠 Decisiones Técnicas y Retos

- **Unificación de Fuentes de Datos**: Se diseñó una lógica en el backend para normalizar y unificar las respuestas asíncronas provenientes de la PokéAPI con los registros de la base de datos local (PostgreSQL). Esto garantiza que el frontend reciba un único arreglo estandarizado.
- **Validaciones Estrictas y Controladas:** Para el formulario de creación de nuevos Pokémon, se prescindió de validaciones HTML nativas en favor de un estado 100% controlado por JavaScript. Esto asegura una sanitización profunda de los inputs.
- **Optimización de Renderizado (Paginación):** Dado el volumen masivo de datos que maneja la franquicia, se implementó un sistema de paginación mediante Redux (12 elementos por página) para no sobrecargar el DOM.
- **Lógica de Normalización TCG:** Se desarrolló un algoritmo para transformar los stats base de la API en valores competitivos de juego de cartas (HP, Attack Damage, Retreat Cost).
- **Interfaz Dinámica TCG:** Uso de CSS avanzado para replicar fielmente el diseño de las cartas clásicas de 2008, asegurando responsividad y componentes interactivos para cada tipo de energía.
- **Reto Técnico TCG:** Sincronizar la estética visual de las cartas del TCG con datos dinámicos, manteniendo el rendimiento de carga al procesar múltiples imágenes, lazy loading de lore, y tipos de energía simultáneamente.

---

## 💻 Implementación Técnica (Best Practices)

### ⚡ Manejo de Asincronía (Async/Await)
Se implementó un flujo asíncrono robusto para el renderizado de las cartas TCG. Dado que cada carta requiere datos de múltiples endpoints (stats base + especies/lore), se optimizó el fetching para evitar "waterfalls" de peticiones, garantizando que la carta se muestre completa y sin saltos visuales.

### 🛡️ Gestión de Errores (Try/Catch)
El algoritmo de normalización de stats (conversión a valores TCG) incluye bloques de seguridad para manejar datos nulos o incompletos de la API. Si un Pokémon carece de cierto stat, el sistema asigna valores por defecto balanceados para no romper la interfaz de la carta.

### 🧩 Manejo de Estado y UI Reactiva
Uso intensivo de `useEffect` para el cálculo dinámico de debilidades y resistencias basado en el tipo de Pokémon, asegurando que la carta se actualice instantáneamente al realizar filtrados o búsquedas.

### 🔑 Seguridad de Datos
Al igual que en mis otros proyectos de alto valor, las credenciales de la base de datos PostgreSQL se manejan estrictamente vía variables de entorno (`.env`), protegiendo la integridad del servidor en entornos de producción.

---

## 🗺️ Roadmap (Próximas Mejoras)

- [ ] Implementar un sistema de caché en el servidor para reducir el consumo de la PokéAPI externa y disminuir los tiempos de respuesta (*latency*).
- [ ] Desarrollar tests unitarios para los modelos de la base de datos y rutas principales del backend utilizando Jest y Supertest.
- [ ] Refactorizar el manejo de asincronía en Redux integrando herramientas más modernas como Redux Toolkit.
- [ ] Mecánica de Combate: Implementar lógica de enfrentamiento 1v1 basada en debilidades elementales y tipos de energía.
- [ ] PWA (Progressive Web App): Permitir que la colección de cartas se pueda consultar offline como una app nativa en el móvil.

---

## 👨‍💻 Autor

**Antonio**
- [LinkedIn](TU_URL_DE_LINKEDIN_AQUI) <!-- Reemplazar con URL -->
- [GitHub](https://github.com/barockatr)
