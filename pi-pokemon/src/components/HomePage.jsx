import React, { useState, useEffect } from "react";
import CardsContainer from "./CardsContainer";
import useGameStore from "../store/useGameStore";
import CardDetailModal from "./CardDetailModal";
import "./HomePage.css";



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
  const pokemons = useGameStore(state => state.pokemons);

  return (
    <div className="homepage">
      {/* ⚔️ TCG ARENA TITLE */}
      <div className="arena-header" style={{ paddingTop: '20px' }}>
        <h1 className="arena-title-main">⚔️ TCG ARENA</h1>
        <p className="arena-subtitle">Pokémon Trading Card Network — Global Roster</p>
      </div>

      {/* ⭐ CARTA DEL DÍA */}
      {pokemons.length > 0 && <SpotlightCard pokemons={pokemons} />}

      {/* GRID PRINCIPAL */}
      <CardsContainer />
    </div>
  );
};

export default HomePage;
