import React, { useState, useMemo } from 'react';
import useGameStore from '../store/useGameStore';
import { useNavigate } from 'react-router-dom';
import './PokedexSidebar.css';

const PokedexSidebar = () => {
    const isPokedexOpen = useGameStore(state => state.isPokedexOpen);
    const setIsPokedexOpen = useGameStore(state => state.setIsPokedexOpen);
    const allPokemons = useGameStore(state => state.allPokemons);
    const types = useGameStore(state => state.types);
    const setChallenger = useGameStore(state => state.setChallenger);
    const navigate = useNavigate();

    // Lógica del Entrenador
    const [capturedCount, setCapturedCount] = useState(0);
    const MAX_POKEMON = 151;

    React.useEffect(() => {
        const collection = JSON.parse(localStorage.getItem('myCollection') || '[]');
        setCapturedCount(collection.length);
    }, []);

    React.useEffect(() => {
        const handleStorage = () => {
            const collection = JSON.parse(localStorage.getItem('myCollection') || '[]');
            setCapturedCount(collection.length);
        };
        window.addEventListener('storage', handleStorage);
        const interval = setInterval(handleStorage, 2000);
        return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
    }, []);

    const level = Math.floor(capturedCount / 10) + 1;
    const progressPercent = ((capturedCount % 10) / 10) * 100;

    // Filtros locales
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [originFilter, setOriginFilter] = useState('all'); // all | official | created
    const [sortBy, setSortBy] = useState(''); // atk-desc | atk-asc | hp-desc | hp-asc

    const filteredPokemons = useMemo(() => {
        let result = allPokemons;

        // Fase 2: Buscador Inteligente (Fuzzy Search)
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(p => p.name.toLowerCase().includes(lowerSearch));
        }

        // Fase 3: Filtro por Tipo
        if (selectedType !== 'all') {
            result = result.filter(p => p.types?.includes(selectedType));
        }

        // Fase 3: Filtro por Origen
        if (originFilter === 'created') {
            result = result.filter(p => p.created);
        } else if (originFilter === 'official') {
            result = result.filter(p => !p.created);
        }

        // Fase 3: Ordenamiento por Poder
        if (sortBy) {
            result = [...result]; // Copia antes de mutar
            switch (sortBy) {
                case 'atk-desc': result.sort((a, b) => (b.attack || 0) - (a.attack || 0)); break;
                case 'atk-asc': result.sort((a, b) => (a.attack || 0) - (b.attack || 0)); break;
                case 'hp-desc': result.sort((a, b) => (b.life || 0) - (a.life || 0)); break;
                case 'hp-asc': result.sort((a, b) => (a.life || 0) - (b.life || 0)); break;
                default: break;
            }
        }

        return result;
    }, [allPokemons, searchTerm, selectedType, originFilter, sortBy]);

    // Fase 4: UX de Selección y Redirección
    const handleSelectPokemon = (pokemon) => {
        setIsPokedexOpen(false); // 1. Cerrar Dashboard
        setChallenger(pokemon);  // 2. Marcar como enfocado

        // 3. Redirigir visualmente (Si el usuario quiere ver detalles 3D u Arena)
        // Opcional: navigate('/arena') o despachar evento personalizado para la carta 3D
        const customEvent = new CustomEvent('pokedexSelect', { detail: pokemon });
        window.dispatchEvent(customEvent);
    };

    return (
        <>
            {/* Backdrop para cerrar al hacer clic afuera */}
            <div
                className={`pokedex-sidebar-backdrop ${isPokedexOpen ? 'open' : ''}`}
                onClick={() => setIsPokedexOpen(false)}
            />

            {/* Fase 1: Estructura y Diseño Visual */}
            <div className={`pokedex-sidebar ${isPokedexOpen ? 'open' : ''}`}>
                <div className="pokedex-sidebar-header">
                    <div className="pokedex-lens-container">
                        <div className="pokedex-big-lens"></div>
                        <div className="pokedex-sm-lens red"></div>
                        <div className="pokedex-sm-lens yellow"></div>
                        <div className="pokedex-sm-lens green"></div>
                    </div>
                    <button className="pokedex-close-btn" onClick={() => setIsPokedexOpen(false)}>✖</button>
                </div>

                <div className="pokedex-sidebar-content">
                    {/* Trainer Status Profile Segment */}
                    <div className="sidebar-trainer-status">
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

                    {/* Fase 2: Buscador Inteligente */}
                    <div className="pokedex-search-box">
                        <input
                            type="text"
                            placeholder="Buscar Pokémon..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    {/* Fase 3: Sistema de Filtros Avanzado */}
                    <div className="pokedex-filters">
                        <div className="filter-group">
                            <label>Origen:</label>
                            <div className="toggle-group">
                                <button className={originFilter === 'all' ? 'active' : ''} onClick={() => setOriginFilter('all')}>Todos</button>
                                <button className={originFilter === 'official' ? 'active' : ''} onClick={() => setOriginFilter('official')}>Oficiales</button>
                                <button className={originFilter === 'created' ? 'active' : ''} onClick={() => setOriginFilter('created')}>Creados</button>
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Poder:</label>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="">Ordenar por...</option>
                                <option value="atk-desc">Mayor Ataque (ATK)</option>
                                <option value="atk-asc">Menor Ataque (ATK)</option>
                                <option value="hp-desc">Mayor Vida (HP)</option>
                                <option value="hp-asc">Menor Vida (HP)</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Tipo:</label>
                            <div className="type-pills">
                                <button
                                    className={`type-pill ${selectedType === 'all' ? 'active' : ''}`}
                                    onClick={() => setSelectedType('all')}
                                >
                                    Todos
                                </button>
                                {types && types.map(t => (
                                    <button
                                        key={t.id || t.name}
                                        className={`type-pill ${selectedType === t.name ? 'active' : ''}`}
                                        onClick={() => setSelectedType(t.name)}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Fase 4: Lista Scrolleable de Resultados */}
                    <div className="pokedex-results-list">
                        {filteredPokemons.length > 0 ? (
                            filteredPokemons.map(p => (
                                <div
                                    key={p.id}
                                    className="pokedex-result-item"
                                    onClick={() => handleSelectPokemon(p)}
                                >
                                    <div className="result-sprite-wrapper">
                                        <img src={p.image} alt={p.name} />
                                    </div>
                                    <div className="result-info">
                                        <h4>{p.name}</h4>
                                        <div className="result-stats">
                                            <span className="stat-atk">⚔️ {p.attack}</span>
                                            <span className="stat-hp">❤️ {p.life}</span>
                                        </div>
                                    </div>
                                    <div className="result-action">
                                        👉
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="pokedex-empty-state">
                                🍃 ¡Un Pokémon salvaje huyó! Intenta otra búsqueda.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PokedexSidebar;
