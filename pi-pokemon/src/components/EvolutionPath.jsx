import React from 'react';
import './EvolutionPath.css';

const typeThemeGlow = {
    fire: '#EE8130',
    water: '#6390F0',
    grass: '#7AC74C',
    electric: '#F7D02C',
    psychic: '#F95587',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    ice: '#96D9D6',
    fighting: '#C22E28',
    normal: '#A8A77A',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    bug: '#A6B91A',
    rock: '#B6A136',
    steel: '#B7B7CE',
    fairy: '#D685AD',
};

const EvolutionPath = ({ chain, isFetching, onEvolutionClick, currentPokemonId, primaryType }) => {
    if (isFetching) {
        return (
            <div className="evolution-path-skeleton">
                <div className="evo-skel-ball pulse"></div>
                <div className="evo-skel-line"></div>
                <div className="evo-skel-ball pulse"></div>
            </div>
        );
    }

    if (!chain || chain.length <= 1) {
        return null; // No evolution line or custom pokemon
    }

    const themeColor = typeThemeGlow[primaryType] || '#fff';

    return (
        <div className="evolution-path-container">
            <h4 className="evolution-title">Evolution Line</h4>
            <div className="evolution-timeline">
                {chain.map((evo, index) => {
                    const isActive = evo.id === currentPokemonId;

                    return (
                        <div key={evo.id} className="evolution-node-wrapper">

                            {/* The connector line between nodes */}
                            {index > 0 && <div className="evolution-connector" style={{ background: themeColor }}></div>}

                            <div
                                className={`evolution-node ${isActive ? 'active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isActive) onEvolutionClick(evo);
                                }}
                                style={{
                                    borderColor: isActive ? themeColor : 'rgba(255,255,255,0.2)',
                                    boxShadow: isActive ? `0 0 15px ${themeColor}, inset 0 0 10px ${themeColor}` : 'none',
                                    position: 'relative',
                                    zIndex: 9999,
                                    pointerEvents: 'all'
                                }}
                            >
                                <img src={evo.image} alt={evo.name} className="evolution-sprite" />

                                {/* Hover Tooltip */}
                                <div className="evolution-tooltip">{evo.name}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EvolutionPath;
