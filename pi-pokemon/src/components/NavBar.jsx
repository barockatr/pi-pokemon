import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

    // Don't show NavBar on the Landing Page
    if (location.pathname === '/') return null;

    const level = Math.floor(capturedCount / 10) + 1;
    const progressPercent = ((capturedCount % 10) / 10) * 100;

    return (
        <nav className="global-navbar">
            <Link to="/home" className="navbar-logo-link" style={{ textDecoration: 'none' }}>
                <div className="navbar-logo">
                    <h2>TCG POKÉMON</h2>
                </div>
            </Link>

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
