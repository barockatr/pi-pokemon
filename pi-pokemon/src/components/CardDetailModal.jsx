import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Tilt from 'react-parallax-tilt';
import useGameStore from '../store/useGameStore';
import useDeckStore from '../store/useDeckStore';
import EvolutionPath from './EvolutionPath';
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

    // Module 18: Local Autonomous State
    const [activeDisplayPokemon, setActiveDisplayPokemon] = useState(pokemon);
    const [animationDirection, setAnimationDirection] = useState(1); // 1 = right, -1 = left

    // Holographic transform states
    const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
    const [holoPosition, setHoloPosition] = useState({ x: 50, y: 50 });

    // Module 16 & 21: Evolution Store State
    const { fetchEvolutionChain, currentEvolutionChain, isFetchingEvolution } = useGameStore();

    // Module 22: Deck Builder Express State
    const deck = useDeckStore((state) => state.deck);
    const addCardToDeck = useDeckStore((state) => state.addCard);
    const removeCardFromDeck = useDeckStore((state) => state.removeCard);

    // Reset local state if external pokemon prop changes (e.g., closed and opened a new one)
    useEffect(() => {
        if (pokemon) {
            setActiveDisplayPokemon(pokemon);
            fetchEvolutionChain(pokemon.id);
        }
    }, [pokemon, fetchEvolutionChain]);

    if (!activeDisplayPokemon) return null;

    const primaryType = activeDisplayPokemon.types && activeDisplayPokemon.types.length > 0 ? activeDisplayPokemon.types[0] : 'normal';
    const glowColor = typeGlowColor[primaryType] || 'rgba(255, 255, 255, 0.4)';

    // Module 23 (Radar Chart Data Prep)
    const radarData = [
        { subject: 'HP', A: activeDisplayPokemon.life || 0, fullMark: 150 },
        { subject: 'ATK', A: activeDisplayPokemon.attack || 0, fullMark: 150 },
        { subject: 'DEF', A: activeDisplayPokemon.defense || 0, fullMark: 150 },
        { subject: 'SPD', A: activeDisplayPokemon.speed || 0, fullMark: 150 },
    ];
    // Dynamic Hex color for the Radar line stroke based on primaryType
    const rgbStr = glowColor.replace(/[^\d*,]/g, '').split(',');
    const solidColorHex = rgbStr.length >= 3 ? `#${((1 << 24) + (parseInt(rgbStr[0]) << 16) + (parseInt(rgbStr[1]) << 8) + parseInt(rgbStr[2])).toString(16).slice(1)}` : '#ffcc00';

    // Handler when an evolution node is clicked (Module 21: Asynchronous Navigation)
    const handleEvolutionClick = async (evoNode) => {
        if (evoNode.id === activeDisplayPokemon.id) return;

        // Determine direction of animation (forward or backward in evolution)
        const currentIdx = currentEvolutionChain.findIndex(e => e.id === activeDisplayPokemon.id);
        const targetIdx = currentEvolutionChain.findIndex(e => e.id === evoNode.id);
        setAnimationDirection(targetIdx > currentIdx ? 1 : -1);

        // Si tenemos los stats completos localmente, hacemos el salto instantáneo
        if (evoNode.isLocal) {
            setActiveDisplayPokemon(evoNode);
            return;
        }

        // Si NO están locales, proveemos un fallback visual inmediato para que la UI no se trabe
        const fallbackDisplay = {
            id: evoNode.id,
            name: evoNode.name,
            image: evoNode.image,
            types: ['normal'], // fallback temporal
            life: '...', attack: '...', defense: '...', speed: '...'
        };
        setActiveDisplayPokemon(fallbackDisplay);

        // Y por detrás traemos los verdaderos stats de la API para rellenar la info faltante "on the fly"
        try {
            const res = await fetch(`http://localhost:3001/pokemons/${evoNode.id}`);
            if (res.ok) {
                const fullEvoData = await res.json();
                setActiveDisplayPokemon(fullEvoData);
            }
        } catch (error) {
            console.error("No se pudo obtener el detalle oscuro de la evolución", error);
        }
    };

    // Module 22: Evaluaciones de Mazo
    const isAlreadyInDeck = deck.some(c => c.id === activeDisplayPokemon.id);
    const isDeckFull = deck.length >= 6;

    const handleToggleDeck = (e) => {
        e.stopPropagation();
        if (isAlreadyInDeck) {
            removeCardFromDeck(activeDisplayPokemon.id);
        } else if (!isDeckFull) {
            addCardToDeck(activeDisplayPokemon);
        }
    };

    // Framer Motion Variants
    const fadeSlideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 25 }
        },
        exit: (direction) => ({
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 }
        })
    };

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        // Max tilt angle: 15 degrees
        const rotateY = (mouseX / (rect.width / 2)) * 12;
        const rotateX = -(mouseY / (rect.height / 2)) * 12;

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

            {/* ABSOLUTE BACK BUTTON */}
            <button
                className="cdm-back-btn"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
                <span className="back-arrow">◄</span> REGRESAR
            </button>

            {/* Stop propagation so clicking the CARD doesn't close the modal */}
            <div className="cdm-wrapper" onClick={(e) => e.stopPropagation()}>

                {/* THE 3D CARD USING NATIVE REACT PHYSICS (Tilt library removed due to collision bugs) */}
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="cdm-card parallax-effect"
                    style={{
                        transform: transform,
                        boxShadow: `0 30px 80px ${glowColor}, 0 0 40px ${glowColor}`,
                        background: 'linear-gradient(145deg, #fceb6a, #e8c830)',
                        transition: transform === 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)' ? 'transform 0.5s ease-out' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Animated Content Wrapper */}
                    <AnimatePresence custom={animationDirection} mode="wait">
                        <motion.div
                            key={activeDisplayPokemon.id}
                            custom={animationDirection}
                            variants={fadeSlideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}
                        >
                            {/* CARD HEADER */}
                            <div className="cdm-header">
                                <h2 className="cdm-name">{activeDisplayPokemon.name}</h2>
                                <div className="cdm-hp">
                                    <span className="cdm-hp-label">HP</span>
                                    <span className="cdm-hp-value">{activeDisplayPokemon.life || 50}</span>
                                </div>
                            </div>

                            {/* CARD IMAGE */}
                            <div className="cdm-image-wrap">
                                <img src={activeDisplayPokemon.image} alt={activeDisplayPokemon.name} className="cdm-image" />
                            </div>

                            {/* CARD TYPES */}
                            <div className="cdm-types">
                                {activeDisplayPokemon.types && activeDisplayPokemon.types.map((t, i) => (
                                    <span key={i} className="cdm-type-badge">{t}</span>
                                ))}
                            </div>

                            {/* MODULE 23: RADAR CHART STATS */}
                            <div className="cdm-stats-radar">
                                <ResponsiveContainer width="100%" height={150}>
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#fff" strokeOpacity={0.3} />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar name="Stats" dataKey="A" stroke={solidColorHex} fill={glowColor} fillOpacity={0.7} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* EVOLUTION PATH INTEGRATION */}
                            <EvolutionPath
                                chain={currentEvolutionChain}
                                isFetching={isFetchingEvolution}
                                currentPokemonId={activeDisplayPokemon.id}
                                primaryType={primaryType}
                                onEvolutionClick={handleEvolutionClick}
                            />

                            {/* FOOTER & DECK BUILDER MODULE 22 */}
                            <div className="cdm-footer" style={{ position: 'relative', zIndex: 9999 }}>
                                <span>Type: <strong>{primaryType}</strong></span>

                                <button
                                    className={`cdm-deck-btn ${isAlreadyInDeck ? 'removing' : ''} ${isDeckFull && !isAlreadyInDeck ? 'disabled' : ''}`}
                                    onClick={handleToggleDeck}
                                    style={{ position: 'relative', pointerEvents: 'all', zIndex: 9999 }}
                                    disabled={isDeckFull && !isAlreadyInDeck}
                                >
                                    {isAlreadyInDeck ? '➖ Quitar del Mazo' : isDeckFull ? '🚫 Mazo Lleno' : '➕ Añadir a mi Mazo'}
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p className="cdm-hint">Inicia el escaneo táctico (Hover sobre carta) ✨</p>
            </div>
        </div>
    );
};

export default CardDetailModal;
