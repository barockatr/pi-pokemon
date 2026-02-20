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
**PI Pokémon** resuelve la necesidad de contar con una "Pokédex" centralizada e interactiva. Permite a los usuarios consultar rápidamente información de la PokéAPI, realizar filtrados y ordenamientos combinados, e incluso crear y almacenar sus propios Pokémon personalizados en una base de datos relacional. Todo desarrollado con un enfoque en rendimiento de consultas, manejo eficiente del estado global y una UX/UI dinámica.

---

## ✨ Características Clave
- **Búsqueda y Paginación**: Localiza a tu Pokémon favorito por nombre exacto o explora todo el listado mediante un rápido sistema de paginación (12 elementos por página).
- **Detalles Completos**: Visualiza a fondo las estadísticas clave de cada criatura, incluyendo ataque, vida, defensa, velocidad, dimensiones y sus respectivos tipos.
- **Filtros Avanzados**: Ordena los resultados de manera alfabética, por nivel de ataque, o filtra la vista según el tipo del Pokémon y su procedencia (API original vs creados en BD local).
- **Creación Personalizada**: Formulario interactivo con validaciones estrictas y controladas en JavaScript para poder insertar nuevos Pokémon en el universo local de la aplicación.

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
