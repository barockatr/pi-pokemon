import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../../store/useGameStore';
import Filter from '../Filter';
import './SidebarPokedex.css';

const SidebarPokedex = ({ setCurrentPage, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Módulo 19: Debounce Ref
    const searchTimeoutRef = useRef(null);

    const navigate = useNavigate();

    // Acceso al array base para fuzzy search
    const allPokemons = useGameStore((state) => state.pokemons);
    const getPokemonByName = useGameStore((state) => state.getPokemonByName);

    // Módulo 14 y 19: Búsqueda Inteligente (Fuzzy Search Básico + Debounce)
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchTerm(val);

        if (val.trim() === "") {
            setSuggestions([]);
            setIsSearching(false);
            if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
            return;
        }

        setIsSearching(true);

        // Limpiar el timeout anterior si el usuario sigue tecleando
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Establecer el nuevo timeout (Debounce de 300ms)
        searchTimeoutRef.current = setTimeout(() => {
            // Fuzzy search: convert to lower case and check includes
            const lowerVal = val.toLowerCase();
            const matches = allPokemons.filter(p => p.name.toLowerCase().includes(lowerVal));

            // Limitar a top 5 para el dropdown
            setSuggestions(matches.slice(0, 5));
            setIsSearching(false);

            // Mark as 'empty state' if no matches found but we have a search term
            if (matches.length === 0) {
                setSuggestions([{ id: 'empty', isEmpty: true }]);
            }

        }, 300);
    };

    const executeSearch = (nameToSearch) => {
        if (!nameToSearch || nameToSearch === 'empty') return;
        getPokemonByName(nameToSearch);
        setSearchTerm("");
        setSuggestions([]);
        setCurrentPage(0);
        setIsFocused(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch(searchTerm);
        }
    };

    return (
        <>
            {/* Módulo 1: Pestaña Flotante Toggle */}
            <button
                className={`sidebar-toggle-btn ${isOpen ? 'open' : ''}`}
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (onToggle) onToggle(!isOpen);
                }}
            >
                <span className="toggle-icon">{isOpen ? '✖' : '🔍'}</span>
            </button>

            {/* Backdrop oscuro para móviles */}
            {isOpen && <div className="sidebar-backdrop" onClick={() => {
                setIsOpen(false);
                if (onToggle) onToggle(false);
            }}></div>}

            {/* Contenedor Principal del Sidebar */}
            <div className={`sidebar-pokedex-shell ${isOpen ? 'open' : ''}`}>

                {/* ===================================================== */}
                {/* FASE 1: TRAINER HEADER — Cima absoluta, fila con X     */}
                {/* ===================================================== */}
                <div className="sidebar-trainer-header">
                    <div className="trainer-identity">
                        <span className="trainer-hat">🎩</span>
                        <div className="trainer-info">
                            <span className="trainer-header">ENTRENADOR Lv. 1</span>
                            <div className="xp-bar-container">
                                <div className="xp-bar-fill" style={{ width: '30%' }}></div>
                            </div>
                            <span className="mono-stats">Capturadas: 3 / 151</span>
                        </div>
                    </div>
                    <button
                        className="sidebar-close-btn"
                        onClick={() => {
                            setIsOpen(false);
                            if (onToggle) onToggle(false);
                        }}
                        aria-label="Cerrar sidebar"
                    >
                        ✕
                    </button>
                </div>

                {/* ===================================================== */}
                {/* FASE 2: CUERPO CENTRAL — Buscador + Filtros            */}
                {/* ===================================================== */}
                <div className="sidebar-scroll-area">
                    <div className="sidebar-section tactical-unified-filters">
                        <div className="sidebar-header" style={{ padding: 0, border: 'none', marginBottom: '15px' }}>
                            <div className="search-wrapper">
                                <label htmlFor="pokedexSearch" className="sr-only" style={{ display: 'none' }}>Buscar Pokémon</label>
                                <input
                                    id="pokedexSearch"
                                    name="pokedexSearch"
                                    type="text"
                                    placeholder="Buscar Pokémon..."
                                    className="fuzzy-search-input"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                />
                                <button className="search-exec-btn" onClick={() => executeSearch(searchTerm)}>Ir</button>

                                {isFocused && (suggestions.length > 0 || isSearching) && (
                                    <ul className="suggestions-dropdown">
                                        {isSearching ? (
                                            <li className="suggestion-loading">Rastreando Pokédex...</li>
                                        ) : suggestions[0]?.isEmpty ? (
                                            <li className="suggestion-empty">
                                                <span className="empty-icon">🍃</span>
                                                ¡Vaya! Parece que ese Pokémon huyó de la hierba alta.
                                            </li>
                                        ) : (
                                            suggestions.map(s => (
                                                <li key={s.id} onClick={() => executeSearch(s.name)}>
                                                    <img src={s.image} alt={s.name} className="suggestion-sprite" />
                                                    <span>{s.name}</span>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>

                        <div className="sidebar-body" style={{ padding: 0 }}>
                            <Filter setCurrentPage={setCurrentPage} isSidebar={true} />
                        </div>
                    </div>

                    {/* EQUIPO ACTUAL */}
                    <div className="sidebar-section current-team-container">
                        <h4>EQUIPO ACTUAL</h4>
                        <div className="team-scrollbox">
                            <div className="team-slot"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png" alt="Charmeleon" /><span>charmeleon</span></div>
                            <div className="team-slot"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png" alt="Blastoise" /><span>blastoise</span></div>
                            <div className="team-slot"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" alt="Pikachu" /><span>pikachu</span></div>
                        </div>
                    </div>
                </div>

                {/* ===================================================== */}
                {/* FASE 3: FOOTER — Carta del Día + Arena Button           */}
                {/* ===================================================== */}
                <div className="sidebar-footer">

                    {/* Panel de Previsualización: Carta del Día */}
                    <div className="card-of-the-day-footer">
                        <span className="cotd-title">CARTA DEL DÍA</span>
                        <div className="cotd-image-wrapper">
                            <img
                                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png"
                                alt="Charizard"
                                className="cotd-sprite"
                                style={{ filter: 'drop-shadow(0 0 15px rgba(255, 165, 0, 0.5))' }}
                            />
                        </div>
                    </div>

                    {/* Botón de Combate */}
                    <button className="premium-arena-btn" onClick={() => navigate('/arena')}>
                        <span className="btn-glint"></span>
                        IR A LA ARENA
                    </button>
                </div>

            </div>
        </>
    );
};

export default SidebarPokedex;
