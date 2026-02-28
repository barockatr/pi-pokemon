import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { shuffleArray } from '../utils/shuffle';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Store for managing the player's 6-card combat deck and bot logic
const useDeckStore = create(
    persist(
        (set, get) => ({
            deck: [],
            opponentHand: [],
            isInitializing: true, // Módulo 2: Skeletons Flag

            // Update the opponent's hand array (used by PvEBot to shift cards)
            setOpponentHand: (newHand) => set({ opponentHand: newHand }),

            // Add a card to the deck (max 6)
            addCard: (card) => {
                const currentDeck = get().deck;

                if (currentDeck.length >= 6) {
                    console.warn("Deck limit reached! Maximum 6 cards allowed.");
                    // Could trigger a custom toast here if a global toast system is added
                    return false; // Indicates failure to add
                }

                // Optional: Prevent duplicates if desired, but typical TCG allows multiple
                // If we want to prevent identical objects:
                const isAlreadyInDeck = currentDeck.some(c => c.id === card.id);
                if (isAlreadyInDeck) {
                    console.warn("Card is already in the deck!");
                    return false;
                }

                set({ deck: [...currentDeck, card] });
                return true; // Indicates success
            },

            // Remove a card from the deck by its ID
            removeCard: (cardId) => {
                set((state) => ({
                    deck: state.deck.filter((c) => c.id !== cardId)
                }));
            },

            // Clear the entire deck
            clearDeck: () => {
                set({ deck: [] });
            },

            // --- Módulo 2: Rejugabilidad del Bot ---
            generarMazoBot: async () => {
                set({ isInitializing: true });
                try {
                    // Delay artificial mínimo para que el skeleton se respire (opcional, pero mejora la UX para no parpadear)
                    await new Promise(r => setTimeout(r, 600));

                    // Fetch all pokemons from API to form a pool
                    const response = await axios.get(`${API_URL}/pokemons`);
                    const allPokemons = response.data;

                    // Usamos Fisher-Yates puro para una distribución uniforme
                    const shuffledPool = shuffleArray(allPokemons);

                    // 2. Tomar los primeros 6 para la mano del bot
                    const selectedPokemons = shuffledPool.slice(0, 6).map((card, idx) => ({
                        ...card,
                        // Attach a unique ID string to avoid React key collisions during combat
                        currentInstanceId: `bot-card-${card.id}-${idx}`,
                        // Give them a flat basic ATK if mapped weirdly, but usually 'attack' is present
                        attackDamage: card.attack || 40
                    }));

                    // Assign to the opponent's hand
                    set({ opponentHand: selectedPokemons, isInitializing: false });

                } catch (error) {
                    console.error("Error generating Bot Deck:", error);
                    // Fallback just in case
                    set({ opponentHand: [], isInitializing: false });
                }
            })
        , {
            name: 'tcg-deck-storage', // Clave única en el localStorage
            storage: createJSONStorage(() => localStorage),
            version: 1, // Módulo 2: Versionado contra caché agresivo
            migrate: (persistedState, version) => {
                // Si hay un cambio de estructura en el futuro (ej. version 2), aquí se mapean los datos viejos
                if (version === 0) {
                    // migración hipotética desde estado viejo
                    persistedState.deck = persistedState.oldDeckFormat || [];
                }
                return persistedState;
            },
            partialize: (state) => ({ deck: state.deck }), // Solo guardamos la baraja del jugador en caché, no variables UI como isInitializing o las cartas del bot
        })
);

export default useDeckStore;
