import { create } from 'zustand';
import axios from 'axios';
import { shuffleArray } from '../utils/shuffle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log(`[Vite Env Vercel] Inicializando Store. API Target:`, API_URL);

// Store global centralizado (Reemplazo total de Redux)
const useGameStore = create((set, get) => ({
    // --- 1. ESTADO GLOBAL ---
    pokemons: [],
    allPokemons: [],
    types: [],
    challenger: null,
    globalError: false,
    errorMessage: "",

    // Module 16: Evolution State
    currentEvolutionChain: [],
    isFetchingEvolution: false,

    // --- 2. ACCIONES ASÍNCRONAS (Ex-Thunks) ---
    getPokemons: async () => {
        try {
            const { data } = await axios.get(`${API_URL}/pokemons`);
            // Módulo 2: Inyección de Aleatoriedad Real (Fisher-Yates) pura
            const shuffled = shuffleArray(data);

            set({
                pokemons: shuffled,
                allPokemons: shuffled,
                globalError: false,
                errorMessage: ""
            });
        } catch (error) {
            console.error("Error fetching pokemons:", error);
            set({
                globalError: true,
                errorMessage: "El Centro Pokémon está fuera de servicio. Intenta más tarde."
            });
        }
    },

    getTypes: async () => {
        try {
            const { data } = await axios.get(`${API_URL}/types`);
            set({ types: data });
        } catch (error) {
            console.error("Error fetching types:", error);
            set({
                globalError: true,
                errorMessage: "Error al conectar con la Pokédex Nacional."
            });
        }
    },

    getPokemonByName: async (name) => {
        try {
            const { data } = await axios.get(`${API_URL}/pokemons?name=${name}`);
            set({ pokemons: data });
        } catch (error) {
            console.error("Error fetching pokemon by name:", error);
            set({
                globalError: true,
                errorMessage: "Pokémon no encontrado en los registros."
            });
        }
    },

    // Módulo 16: Lógica de Evoluciones
    fetchEvolutionChain: async (pokemonId) => {
        // Ignoramos pokemons customizados de DB que tienen UUID largos
        if (!pokemonId || isNaN(parseInt(pokemonId)) || pokemonId.toString().length >= 10) {
            set({ currentEvolutionChain: [] });
            return;
        }

        set({ isFetchingEvolution: true, currentEvolutionChain: [] });

        try {
            // 1. Obtener la especie para sacar la URL de la cadena evolutiva
            const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
            const chainUrl = speciesRes.data.evolution_chain?.url;

            if (!chainUrl) {
                set({ isFetchingEvolution: false, currentEvolutionChain: [] });
                return;
            }

            // 2. Obtener el árbol evolutivo
            const chainRes = await axios.get(chainUrl);
            const chainData = chainRes.data.chain;

            // 3. Aplanar el árbol recursivamente
            const flatChain = [];
            const extractEvolutions = (node) => {
                if (!node) return;

                // Parse ID from URL to get the exact sprite, URL ends in /id/
                const urlParts = node.species.url.split('/');
                const id = urlParts[urlParts.length - 2];

                flatChain.push({
                    id: parseInt(id),
                    name: node.species.name,
                    // Fallback to raw PokeAPI sprite so it always works even if not loaded in local store
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                });

                if (node.evolves_to && node.evolves_to.length > 0) {
                    node.evolves_to.forEach(nextEvo => extractEvolutions(nextEvo));
                }
            };

            extractEvolutions(chainData);

            // 4. Mapear con datos locales si existen (para stats exactos si el usuario da click)
            const { allPokemons } = get();
            const enrichedChain = flatChain.map(evo => {
                const localMatch = allPokemons.find(p => p.id === evo.id);
                return localMatch ? { ...evo, isLocal: true, ...localMatch } : { ...evo, isLocal: false };
            });

            set({ currentEvolutionChain: enrichedChain, isFetchingEvolution: false });

        } catch (error) {
            console.error("Error fetching evolution chain:", error);
            set({ isFetchingEvolution: false, currentEvolutionChain: [] });
        }
    },

    // --- 3. ACCIONES SÍNCRONAS (Filtros y Ordenamiento) ---
    filterByType: (type) => {
        const { allPokemons } = get();
        const typeFiltered = type === 'all'
            ? allPokemons
            : allPokemons.filter(p => p.types?.includes(type));

        set({ pokemons: typeFiltered });
    },

    filterByCreate: (status) => {
        const { allPokemons } = get();
        let createdFilter;

        if (status === 'all') {
            createdFilter = allPokemons;
        } else if (status === 'created') {
            createdFilter = allPokemons.filter(p => p.created);
        } else {
            // Desde la API (no creados)
            createdFilter = allPokemons.filter(p => !p.created);
        }

        set({ pokemons: createdFilter });
    },

    orderByName: (order) => {
        const { pokemons } = get();
        const sortedName = order === 'asc'
            ? [...pokemons].sort((a, b) => a.name.localeCompare(b.name))
            : [...pokemons].sort((a, b) => b.name.localeCompare(a.name));

        set({ pokemons: sortedName });
    },

    orderByAttack: (order) => {
        const { pokemons } = get();
        const sortedAttack = order === 'asc'
            ? [...pokemons].sort((a, b) => a.attack - b.attack)
            : [...pokemons].sort((a, b) => b.attack - a.attack);

        set({ pokemons: sortedAttack });
    },

    filterByAttackRange: (minAttack) => {
        const { allPokemons } = get();
        // Filtrar desde el array original para no perder datos si subimos el slider y luego lo bajamos
        const attackFiltered = allPokemons.filter(p => (p.attack || 0) >= minAttack);
        set({ pokemons: attackFiltered });
    },

    filterByLifeRange: (minLife) => {
        const { allPokemons } = get();
        // Filtrar desde el array original
        const lifeFiltered = allPokemons.filter(p => (p.life || 0) >= minLife);
        set({ pokemons: lifeFiltered });
    },

    // --- 4. ACCIONES DE UTILIDAD ---
    clearHome: () => {
        const { allPokemons } = get();
        set({ pokemons: allPokemons });
    },

    setChallenger: (pokemonContext) => {
        set({ challenger: pokemonContext });
    },

    clearChallenger: () => {
        set({ challenger: null });
    },

    clearGlobalError: () => {
        set({ globalError: false, errorMessage: "" });
    }
}));

export default useGameStore;
