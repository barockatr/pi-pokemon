import { create } from 'zustand';
import axios from 'axios';
import { shuffleArray } from '../utils/shuffle';

// Store global centralizado (Reemplazo total de Redux)
const useGameStore = create((set, get) => ({
    // --- 1. ESTADO GLOBAL ---
    pokemons: [],
    allPokemons: [],
    types: [],
    challenger: null,
    globalError: false,
    errorMessage: "",

    // --- 2. ACCIONES ASÍNCRONAS (Ex-Thunks) ---
    getPokemons: async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/pokemons');
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
            const { data } = await axios.get('http://localhost:3001/types');
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
            const { data } = await axios.get(`http://localhost:3001/pokemons?name=${name}`);
            set({ pokemons: data });
        } catch (error) {
            console.error("Error fetching pokemon by name:", error);
            set({
                globalError: true,
                errorMessage: "Pokémon no encontrado en los registros."
            });
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
