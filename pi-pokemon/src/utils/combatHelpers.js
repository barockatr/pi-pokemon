// Helper dictionary mapping Pokémon Types to their primary Weakness and Resistance in the TCG
// Note: This is an approximation based on classic TCG rules, optimized for the frontend.
export const typeMatchups = {
    normal: { weakness: "fighting", resistance: "ghost" },
    fire: { weakness: "water", resistance: null },
    water: { weakness: "electric", resistance: null },
    electric: { weakness: "fighting", resistance: "steel" },
    grass: { weakness: "fire", resistance: "water" },
    ice: { weakness: "fire", resistance: null },
    fighting: { weakness: "psychic", resistance: null },
    poison: { weakness: "psychic", resistance: null },
    ground: { weakness: "grass", resistance: "electric" },
    flying: { weakness: "electric", resistance: "fighting" },
    psychic: { weakness: "dark", resistance: null },
    bug: { weakness: "fire", resistance: null },
    rock: { weakness: "water", resistance: null },
    ghost: { weakness: "dark", resistance: "fighting" },
    dragon: { weakness: "fairy", resistance: null },
    dark: { weakness: "fighting", resistance: "psychic" },
    steel: { weakness: "fire", resistance: "grass" },
    fairy: { weakness: "steel", resistance: "dark" },
};

/**
 * Calcula el daño final considerando tipos elementales.
 * @param {Object} attacker - Datos del Pokémon que ataca (debe tener .type).
 * @param {Object} defender - Datos del Pokémon que recibe el golpe (debe tener .weakness y .resistance).
 * @param {number} baseDamage - Daño base del movimiento (ej: 50).
 * @returns {number} - Daño total aplicado.
 */
export const calculateDamage = (attacker, defender, baseDamage) => {
    try {
        let finalDamage = baseDamage;

        if (!attacker?.type || !defender?.weakness) {
            console.warn("Faltan datos elementales para calcular el daño. Retornando daño base.");
            return finalDamage;
        }

        // 1. Lógica de Debilidad (Weakness): x2 de daño
        if (defender.weakness === attacker.type) {
            finalDamage *= 2;
            console.log(`¡Es súper efectivo! Daño duplicado por debilidad.`);
        }

        // 2. Lógica de Resistencia (Resistance): -20 de daño (estándar TCG)
        if (defender.resistance && defender.resistance === attacker.type) {
            finalDamage = Math.max(0, finalDamage - 20);
            console.log(`El daño fue reducido por resistencia.`);
        }

        return finalDamage;
    } catch (error) {
        console.error("Error al calcular el daño del combate:", error);
        return baseDamage; // Fallback seguro
    }
};
