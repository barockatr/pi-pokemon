import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();
    // Spotlight logic
    const [spotlight, setSpotlight] = useState(null);
    // FASE 3: Estado local de modal eliminado.
    const setPokemonForDetail = useGameStore(state => state.setPokemonForDetail);
    const pokemons = useGameStore(state => state.pokemons);
    const setIsPokedexOpen = useGameStore(state => state.setIsPokedexOpen);

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

    return (
        <nav className="global-navbar">
            <button
                className="navbar-search-btn"
                onClick={() => setIsPokedexOpen(true)}
                title="Búsqueda Global"
            >
                🔍
            </button>

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
                    <div className="spotlight-header-card" onClick={() => setPokemonForDetail(spotlight)}>
                        <div className="spotlight-holo" />
                        <div className="spotlight-content">
                            <img src={spotlight.image} alt={spotlight.name} className="spotlight-img" />
                            <div className="spotlight-info">
                                <p className="spotlight-name">{spotlight.name}</p>
                                <p className="spotlight-attack">⚔️ ATK: {spotlight.attack}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
};

export default NavBar;
