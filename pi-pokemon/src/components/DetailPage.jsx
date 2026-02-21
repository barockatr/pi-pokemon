import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./DetailPage.css";

const DetailPage = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/pokemons/${id}`);
        setPokemon(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el Pokémon:", error);
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <div className="dp-container">
        <div className="dp-loading">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Loading" className="dp-spinner" />
          <p>CARGANDO DATOS...</p>
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="dp-container">
        <p className="dp-error">No se pudo cargar el Pokémon</p>
        <Link to="/home" className="dp-back-btn">← Volver al Home</Link>
      </div>
    );
  }

  const primaryType = pokemon.types && pokemon.types.length > 0 ? pokemon.types[0] : 'normal';
  const attackDamage = pokemon.attack ? Math.round(pokemon.attack / 2) : 10;

  return (
    <div className="dp-container">
      <Link to="/home" className="dp-back-btn">← Volver al Dashboard</Link>

      <div className="dp-layout">
        {/* TCG Card Visual */}
        <div className="dp-card">
          <div className="dp-card-header">
            <h2 className="dp-name">{pokemon.name}</h2>
            <div className="dp-hp">
              <span className="dp-hp-label">HP</span>
              <span className="dp-hp-value">{pokemon.life || 50}</span>
            </div>
          </div>
          <div className="dp-image-box">
            <img src={pokemon.image} alt={pokemon.name} className="dp-image" />
          </div>
          <div className="dp-types">
            {pokemon.types?.map((t, i) => (
              <span key={i} className="dp-type-badge">{t}</span>
            ))}
          </div>
          <div className="dp-move">
            <span className="dp-move-label">⚡ Ataque Base</span>
            <span className="dp-move-damage">{attackDamage}</span>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="dp-stats-panel">
          <h3 className="dp-panel-title">📊 ESTADÍSTICAS</h3>
          <div className="dp-stat-row">
            <span className="dp-stat-label">❤️ Vida</span>
            <div className="dp-stat-bar-bg">
              <div className="dp-stat-bar-fill" style={{ width: `${Math.min((pokemon.life / 150) * 100, 100)}%`, backgroundColor: '#7AC74C' }} />
            </div>
            <span className="dp-stat-num">{pokemon.life}</span>
          </div>
          <div className="dp-stat-row">
            <span className="dp-stat-label">⚔️ Ataque</span>
            <div className="dp-stat-bar-bg">
              <div className="dp-stat-bar-fill" style={{ width: `${Math.min((pokemon.attack / 150) * 100, 100)}%`, backgroundColor: '#EE8130' }} />
            </div>
            <span className="dp-stat-num">{pokemon.attack}</span>
          </div>
          <div className="dp-stat-row">
            <span className="dp-stat-label">🛡️ Defensa</span>
            <div className="dp-stat-bar-bg">
              <div className="dp-stat-bar-fill" style={{ width: `${Math.min((pokemon.defense / 150) * 100, 100)}%`, backgroundColor: '#6390F0' }} />
            </div>
            <span className="dp-stat-num">{pokemon.defense}</span>
          </div>
          <div className="dp-stat-row">
            <span className="dp-stat-label">💨 Velocidad</span>
            <div className="dp-stat-bar-bg">
              <div className="dp-stat-bar-fill" style={{ width: `${Math.min((pokemon.speed / 150) * 100, 100)}%`, backgroundColor: '#F7D02C' }} />
            </div>
            <span className="dp-stat-num">{pokemon.speed}</span>
          </div>

          <div className="dp-extra-info">
            <div className="dp-info-chip">📏 Altura: {pokemon.height} dm</div>
            <div className="dp-info-chip">⚖️ Peso: {pokemon.weight} hg</div>
            <div className="dp-info-chip">🪪 ID: #{pokemon.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
