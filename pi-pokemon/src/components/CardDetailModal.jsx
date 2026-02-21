import React, { useState, useRef } from 'react';
import './CardDetailModal.css';

// Helper: type color for dynamic glow shadow
const typeGlowColor = {
    fire: 'rgba(238, 129, 48, 0.6)',
    water: 'rgba(99, 144, 240, 0.6)',
    grass: 'rgba(122, 199, 76, 0.6)',
    electric: 'rgba(247, 208, 44, 0.7)',
    psychic: 'rgba(249, 85, 135, 0.6)',
    ghost: 'rgba(115, 87, 151, 0.6)',
    dragon: 'rgba(111, 53, 252, 0.6)',
    dark: 'rgba(112, 87, 70, 0.6)',
    ice: 'rgba(150, 217, 214, 0.6)',
    fighting: 'rgba(194, 46, 40, 0.6)',
    normal: 'rgba(168, 167, 122, 0.5)',
    poison: 'rgba(163, 62, 161, 0.6)',
    ground: 'rgba(226, 191, 101, 0.6)',
    flying: 'rgba(169, 143, 243, 0.6)',
    bug: 'rgba(166, 185, 26, 0.6)',
    rock: 'rgba(182, 161, 54, 0.6)',
    steel: 'rgba(183, 183, 206, 0.6)',
    fairy: 'rgba(214, 133, 173, 0.6)',
};

const CardDetailModal = ({ pokemon, onClose }) => {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    const [holoPosition, setHoloPosition] = useState({ x: 50, y: 50 });

    if (!pokemon) return null;

    const primaryType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0] : 'normal';
    const glowColor = typeGlowColor[primaryType] || 'rgba(255, 255, 255, 0.4)';

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Max tilt angle: 15 degrees
        const rotateY = (mouseX / (rect.width / 2)) * 15;
        const rotateX = -(mouseY / (rect.height / 2)) * 15;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);

        // Move holo foil gradient with mouse
        const holoX = ((e.clientX - rect.left) / rect.width) * 100;
        const holoY = ((e.clientY - rect.top) / rect.height) * 100;
        setHoloPosition({ x: holoX, y: holoY });
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
        setHoloPosition({ x: 50, y: 50 });
    };

    return (
        <div className="cdm-overlay" onClick={onClose}>
            {/* Stop propagation so clicking the CARD doesn't close the modal */}
            <div className="cdm-wrapper" onClick={(e) => e.stopPropagation()}>

                <button className="cdm-close-btn" onClick={onClose}>✕</button>

                {/* THE 3D CARD */}
                <div
                    ref={cardRef}
                    className="cdm-card"
                    style={{
                        transform,
                        boxShadow: `0 30px 80px ${glowColor}, 0 0 40px ${glowColor}`,
                        transition: transform.includes('0deg') ? 'transform 0.6s ease, box-shadow 0.6s ease' : 'none',
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* HOLOGRAPHIC FOIL LAYER */}
                    <div
                        className="cdm-holo-foil"
                        style={{
                            background: `radial-gradient(circle at ${holoPosition.x}% ${holoPosition.y}%,
                rgba(255,255,255,0.3) 0%,
                rgba(255,120,80,0.15) 20%,
                rgba(80,120,255,0.15) 40%,
                rgba(80,255,180,0.15) 60%,
                rgba(255,220,80,0.1) 80%,
                transparent 100%)`,
                        }}
                    />

                    {/* CARD HEADER */}
                    <div className="cdm-header">
                        <h2 className="cdm-name">{pokemon.name}</h2>
                        <div className="cdm-hp">
                            <span className="cdm-hp-label">HP</span>
                            <span className="cdm-hp-value">{pokemon.life || 50}</span>
                        </div>
                    </div>

                    {/* CARD IMAGE */}
                    <div className="cdm-image-wrap">
                        <img src={pokemon.image} alt={pokemon.name} className="cdm-image" />
                    </div>

                    {/* CARD TYPES */}
                    <div className="cdm-types">
                        {pokemon.types && pokemon.types.map((t, i) => (
                            <span key={i} className="cdm-type-badge">{t}</span>
                        ))}
                    </div>

                    {/* STATS */}
                    <div className="cdm-stats">
                        <div className="cdm-stat">
                            <span className="cdm-stat-label">ATK</span>
                            <span className="cdm-stat-value">{pokemon.attack || '—'}</span>
                        </div>
                        <div className="cdm-stat">
                            <span className="cdm-stat-label">DEF</span>
                            <span className="cdm-stat-value">{pokemon.defense || '—'}</span>
                        </div>
                        <div className="cdm-stat">
                            <span className="cdm-stat-label">SPD</span>
                            <span className="cdm-stat-value">{pokemon.speed || '—'}</span>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="cdm-footer">
                        <span>Type: <strong>{primaryType}</strong></span>
                    </div>
                </div>

                <p className="cdm-hint">Mueve el mouse sobre la carta ✨</p>
            </div>
        </div>
    );
};

export default CardDetailModal;
