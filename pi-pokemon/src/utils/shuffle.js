/**
 * shuffleArray - Algoritmo Fisher-Yates (Knuth Shuffle)
 * 
 * ¿Por qué Fisher-Yates y no `array.sort(() => Math.random() - 0.5)`?
 * El método `sort` con `Math.random()` introduce un sesgo matemático (bias) debido a 
 * cómo los motores de JavaScript implementan los algoritmos de ordenamiento (ej. Timsort en V8). 
 * No todas las permutaciones tienen la misma probabilidad de ocurrir, lo que en un TCG 
 * significa que ciertas cartas aparecerían juntas con más frecuencia.
 * 
 * Fisher-Yates garantiza una complejidad O(n) y una distribución perfectamente uniforme (aleatoriedad real),
 * intercambiando cada elemento con uno elegido al azar de los elementos restantes.
 * 
 * @param {Array} array - El arreglo original a barajar.
 * @returns {Array} - Una nueva copia del arreglo barajado de forma justa y sin mutar el original.
 */
export const shuffleArray = (array) => {
    // 1. Clocar para mantener la función pura (Inmutabilidad para React/Zustand)
    const shuffled = [...array];

    // 2. Iterar desde el último elemento hacia el primero
    for (let i = shuffled.length - 1; i > 0; i--) {
        // 3. Elegir un índice aleatorio entre 0 y el índice actual (inclusive)
        const j = Math.floor(Math.random() * (i + 1));

        // 4. Intercambiar los elementos in-place en la nueva copia
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};
