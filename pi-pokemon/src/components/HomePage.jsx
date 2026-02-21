import React, { useState, useEffect } from "react";
import CardsContainer from "./CardsContainer";
import { useSelector } from "react-redux";
import CardDetailModal from "./CardDetailModal";
import "./HomePage.css";

const TrainerStatus = () => {
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
    // Also poll every 2s to catch updates within same tab
    const interval = setInterval(handleStorage, 2000);
    return () => { window.removeEventListener('storage', handleStorage); clearInterval(interval); };
  }, []);

  const level = Math.floor(capturedCount / 10) + 1;
  const progressPercent = ((capturedCount % 10) / 10) * 100;

  return (
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
  );
};

const SpotlightCard = ({ pokemons }) => {
  const [spotlight, setSpotlight] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    if (pokemons && pokemons.length > 0) {
      // Pick a random rare Pokémon (high attack)
      const sorted = [...pokemons].sort((a, b) => (b.attack || 0) - (a.attack || 0));
      const topTen = sorted.slice(0, 10);
      const random = topTen[Math.floor(Math.random() * topTen.length)];
      setSpotlight(random);
    }
  }, [pokemons]);

  if (!spotlight) return null;

  return (
    <>
      <div className="spotlight-section">
        <h3 className="spotlight-title">⭐ CARTA DEL DÍA</h3>
        <div className="spotlight-card" onClick={() => setSelectedPokemon(spotlight)}>
          <div className="spotlight-holo" />
          <div className="spotlight-content">
            <img src={spotlight.image} alt={spotlight.name} className="spotlight-img" />
            <div className="spotlight-info">
              <p className="spotlight-name">{spotlight.name}</p>
              <p className="spotlight-attack">⚔️ ATK: {spotlight.attack}</p>
              <p className="spotlight-types">
                {spotlight.types?.map((t, i) => <span key={i} className="spotlight-badge">{t}</span>)}
              </p>
              <p className="spotlight-hint">Clic para ver en 3D ✨</p>
            </div>
          </div>
        </div>
      </div>
      <CardDetailModal pokemon={selectedPokemon} onClose={() => setSelectedPokemon(null)} />
    </>
  );
};

const HomePage = () => {
  const pokemons = useSelector(state => state.pokemons);

  return (
    <div className="homepage">
      {/* ⚔️ TCG ARENA TITLE */}
      <div className="arena-header">
        <h1 className="arena-title-main">⚔️ TCG ARENA</h1>
        <p className="arena-subtitle">Pokémon Trading Card Network — Global Roster</p>
      </div>

      {/* 🧢 TRAINER STATUS */}
      <TrainerStatus />

      {/* ⭐ CARTA DEL DÍA */}
      {pokemons.length > 0 && <SpotlightCard pokemons={pokemons} />}

      {/* GRID PRINCIPAL */}
      <CardsContainer />
    </div>
  );
};

export default HomePage;
