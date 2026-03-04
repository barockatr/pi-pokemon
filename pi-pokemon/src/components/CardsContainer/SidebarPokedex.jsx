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

                {/* HEADER: Buscador Inteligente */}
                <div className="sidebar-header">
                    <h2>Pokédex OS</h2>
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
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay para poder hacer click en opciones
                        />
                        <button className="search-exec-btn" onClick={() => executeSearch(searchTerm)}>Ir</button>

                        {/* Dropdown de Sugerencias */}
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

                {/* BODY: Filtros (Módulo 15 vendrá aquí) */}
                <div className="sidebar-body">
                    <h3>Filtros de Red</h3>
                    {/* Reutilizamos el Filter temporalmente hasta el Mod 15 */}
                    <Filter setCurrentPage={setCurrentPage} isSidebar={true} />
                </div>

                {/* FOOTER: Botón de Combate */}
                <div className="sidebar-footer">
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
