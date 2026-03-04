import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();
    // Spotlight logic
    // FASE 3: Estado local de modal eliminado.
    const setPokemonForDetail = useGameStore(state => state.setPokemonForDetail);
    const setIsPokedexOpen = useGameStore(state => state.setIsPokedexOpen);

    // Don't show NavBar on the Landing Page
    if (location.pathname === '/') return null;

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

            <button
                className="navbar-search-btn"
                onClick={() => setIsPokedexOpen(true)}
                title="Búsqueda Global"
            >
                🔍
            </button>
        </nav>
    );
};

export default NavBar;
