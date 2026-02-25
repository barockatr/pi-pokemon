import { create } from 'zustand';

// Store for managing the player's 6-card combat deck
const useDeckStore = create((set, get) => ({
    deck: [],

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
    }
}));

export default useDeckStore;
