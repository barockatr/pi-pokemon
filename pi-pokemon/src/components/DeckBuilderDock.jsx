import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDeckStore from '../store/useDeckStore';
import useGameStore from '../store/useGameStore';
import './DeckBuilderDock.css'; // Make sure this CSS has the styling for sticky bottom

const DeckBuilderDock = () => {
    const { deck, removeCard, addCard, clearDeck } = useDeckStore();
    const navigate = useNavigate();
    const location = useLocation();

    // Obtenemos la lista global de Pokémon desde Zustand para el autocompletado aleatorio
    const pokemons = useGameStore((state) => state.pokemons);

    // Ocultar el Dock si ya estamos en la Arena o en el Detail (opcional)
    if (location.pathname === '/arena') return null;

    const MAX_CARDS = 6;
    // Fill the rest with empty slots for visual consistency
    const slots = Array.from({ length: MAX_CARDS }, (_, index) => deck[index] || null);
    const isDeckFull = deck.length === MAX_CARDS;

    const handleStartDuel = () => {
        if (isDeckFull) {
            navigate('/arena');
        }
    };

    const handleRandomizeDeck = () => {
        if (!pokemons || pokemons.length === 0) return;

        clearDeck(); // Vaciamos el mazo actual
        let availablePokemons = [...pokemons];

        // Agregar 6 Pokémon al azar, asegurando que no haya duplicados si es posible
        for (let i = 0; i < MAX_CARDS; i++) {
            if (availablePokemons.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availablePokemons.length);
            const randomPokemon = availablePokemons.splice(randomIndex, 1)[0];
            addCard(randomPokemon); // Zustand maneja esto de forma síncrona excelente
        }
    };

    return (
        <div className="deck-builder-dock">
            <div className="dock-container">
                <div className="dock-header">
                    <h3>
                        Mi Mazo TCG <span className={`deck-count ${isDeckFull ? 'full' : ''}`}>({deck.length}/6)</span>
                    </h3>
                    <p>Selecciona 6 Pokémon para entrar a la Arena</p>
                </div>

                <div className="dock-slots">
                    {slots.map((card, index) => (
                        <div key={index} className={`dock-slot ${card ? 'filled' : 'empty'}`}>
                            {card ? (
                                <>
                                    <img src={card.image} alt={card.name} className="dock-card-img" />
                                    <div className="dock-card-overlay">
                                        <button
                                            className="dock-remove-btn"
                                            onClick={() => removeCard(card.id)}
                                            title="Quitar del Mazo"
                                        >
                                            ❌
                                        </button>
                                        <span className="dock-card-name" title={card.name}>{card.name}</span>
                                    </div>
                                </>
                            ) : (
                                <span className="dock-slot-placeholder">Espacio {index + 1}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="dock-action">
                    <button className="dock-random-btn" onClick={handleRandomizeDeck} title="Mazo Aleatorio">
                        <div className="random-pokeball">
                            <span>?</span>
                        </div>
                    </button>
                    {isDeckFull ? (
                        <button className="dock-duel-btn active pulse-animation" onClick={handleStartDuel}>
                            ¡DUELO! ⚔️
                        </button>
                    ) : (
                        <button className="dock-duel-btn disabled" disabled>
                            Faltan {MAX_CARDS - deck.length} cartas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeckBuilderDock;
