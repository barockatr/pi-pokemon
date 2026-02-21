### ✅ LO QUE SÍ HACE LA APP (Funcionalidad Activa)

**1. El Motor del Backend (La Fuente de Datos)**
- **Conexión Dual:** Tu servidor Express sabe buscar datos simultáneamente en la PokéAPI externa y en tu Base de Datos local (PostgreSQL), y los unifica en un solo formato limpio.
- **Extracción de Movimientos:** Cuando traemos a un Pokémon, el backend ya recorta y nos manda sus primeros 2 "moves" para usarlos en los ataques de las cartas.
- **Creación Personalizada:** Tu ruta `POST` funciona perfectamente para recibir datos de un formulario y guardarlos en tu tabla de PostgreSQL.

**2. Navegación y UX Front-End (React + Vite)**
- **Landing Page Animado:** Al entrar a la app, te recibe el fondo oscuro con el subtítulo CTA y la Pokébola que pulsa. Le das clic y te empuja hacia el Dashboard principal de forma fluida.
- **Dashboard Aleatorio:** Gracias a la lógica en Redux, cada vez que cargas el `/home`, las cartas se revuelven (Shuffling). No ves los mismos 12 Pokémon siempre, ¡la baraja se reparte al azar!
- **Módulo Pedagógico Integrado:** Tienes un botón interactivo en la barra superior que te lleva a la vista estática del Tutorial TCG donde explicamos las reglas, y puedes regresar al Dashboard sin perderte.

**3. El Motor TCG y la UI Dinámica (El Corazón del Proyecto)**
- **Formato Visual Fiel:** Las cartas se renderizan usando CSS Grid simulando cartones de antaño.
- **Cálculo de Daño Base:** Convertimos el "Attack" plano de la API en daño estandarizado de TCG: El ataque 1 hace el 50% y el ataque 2 hace el 75%, redondeados.
- **Multiplicadores Elementales (Debilidades y Resistencias):** Gracias a nuestro helper, la carta lee el tipo primordial del Pokémon e imprime los íconos (ej: 🔥, 💧, ⚡) y números reales en la zona inferior (-20 para resistencias, x2 para debilidad).
- **Lazy Loading de Lore:** El componente inteligente `Card.jsx` va a escondidas a la PokéAPI por el "flavor text" (historia) de la especie en inglés sin tener que bloquear el renderizado de la página principal.
- **Paginación y Filtros:** El usuario puede pasar de página (12 por vista), ordenar alfabéticamente/por daño, o filtrar por origen/tipo elemental.

---

### ❌ LO QUE NO HACE LA APP (Limitaciones Actuales)

**1. No hay Combate Real Activo (Gameplay)**
- **Estado Actual:** Tenemos toda la matemática lista (calculamos daños, debilidades e imprimimos multiplicadores visuales), pero el usuario **no puede pelear**. No tenemos un botón de "VS" ni un simulador de daño donde dos cartas colisionen y le resten vida (HP) a la otra en pantalla.

**2. No hay Inventario / Mi Colección (Persistencia de Usuario)**
- **Estado Actual:** Puedes ver toda la base de datos de Pokémon, pero no puedes armar tu "Mazo" propio (Deck). No hay un botón del tipo "Añadir a Mis Favoritos" ni persistencia de colección.

**3. No hay Animación de Gacha / Apertura de Sobres**
- **Estado Actual:** Hablamos de dar 5 cartas estilo "abrir un sobre de expansión" usando animaciones 3D, pero actualmente solo cargan estáticamente las 12 cartas en el grid.

**4. No es una PWA (Aún)**
- **Estado Actual:** A pesar de que lo pusimos en el Roadmap del README, la aplicación requiere internet constante para cargar las imágenes y conectarse al Backend local. No funciona "Offline".
