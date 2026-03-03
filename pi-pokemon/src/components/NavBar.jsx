import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();
    const [capturedCount, setCapturedCount] = useState(0);
    const MAX_POKEMON = 151;

    useEffect(() => {
        const collection = JSON.parse(localStorage.getItem('myCollection') || '[]');
        setCapturedCount(collection.length);
    }, []);

    // Listen for capture updates
    useEffect(() => {
        const handleStorage = () => {
            const collection = JSON.parse(localStorage.getItem('myCollection') || '[]');
            setCapturedCount(collection.length);
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 2000);
        return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
    }, []);

    // Spotlight logic
    const [spotlight, setSpotlight] = useState(null);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const pokemons = useGameStore(state => state.pokemons);

    useEffect(() => {
        if (pokemons && pokemons.length > 0) {
            const sorted = [...pokemons].sort((a, b) => (b.attack || 0) - (a.attack || 0));
            const topTen = sorted.slice(0, 10);
            const random = topTen[Math.floor(Math.random() * topTen.length)];
            setSpotlight(random);
        }
    }, [pokemons]);

    // Don't show NavBar on the Landing Page
    if (location.pathname === '/') return null;

    const level = Math.floor(capturedCount / 10) + 1;
    const progressPercent = ((capturedCount % 10) / 10) * 100;

    return (
        <nav className="global-navbar">
            <Link to="/home" className="navbar-logo-link" style={{ textDecoration: 'none' }}>
                <div className="navbar-logo">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Pok%C3%A9mon_Trading_Card_Game_logo.svg"
                        alt="Pokémon TCG Logo"
                        className="navbar-logo-img"
                    />
                </div>
            </Link>

            {/* ⭐ CARTA DEL DÍA EN EL HEADER */}
            {spotlight && (
                <>
                    <div className="spotlight-header-card" onClick={() => setSelectedPokemon(spotlight)}>
                        <div className="spotlight-holo" />
                        <div className="spotlight-content">
                            <img src={spotlight.image} alt={spotlight.name} className="spotlight-img" />
                            <div className="spotlight-info">
                                <p className="spotlight-name">{spotlight.name}</p>
                                <p className="spotlight-attack">⚔️ ATK: {spotlight.attack}</p>
                            </div>
                        </div>
                    </div>
                    {selectedPokemon && <CardDetailModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />}
                </>
            )}

            {/* Trainer Status directly in NavBar */}
            <div className="trainer-status">
                <div className="trainer-avatar">🧢</div>
                <div className="trainer-info">
                    <span className="trainer-label">ENTRENADOR Nv.{level}</span>
                    <div className="trainer-progress-bg">
                        <div className="trainer-progress-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                    <span className="trainer-collection">
                        🎴 Capturadas: <strong>{capturedCount}</strong> / {MAX_POKEMON}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
