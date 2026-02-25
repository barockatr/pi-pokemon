import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    // Don't show NavBar on the Landing Page
    if (location.pathname === '/') return null;

    return (
        <nav className="global-navbar">
            <div className="navbar-logo">
                <h2>TCG POKÉMON</h2>
            </div>
            <div className="navbar-links">
                <Link
                    to="/home"
                    className={`nav-btn ${location.pathname === '/home' ? 'active' : ''}`}
                >
                    Pokédex (Armería)
                </Link>
                <Link
                    to="/arena"
                    className={`nav-btn ${location.pathname === '/arena' ? 'active' : ''}`}
                >
                    Arena de Duelo
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
