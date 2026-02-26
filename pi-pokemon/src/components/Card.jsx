import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { typeMatchups, calculateDamage } from "../utils/combatHelpers";
import useDeckStore from "../store/useDeckStore";
import "./Card.css";

// Helper for energy icons (simplified mapping based on type)
const getEnergyIcon = (type) => {
  const energyColors = {
    normal: { bg: "#A8A77A", label: "⚪" },
    fire: { bg: "#EE8130", label: "🔥" },
    water: { bg: "#6390F0", label: "💧" },
    electric: { bg: "#F7D02C", label: "⚡" },
    grass: { bg: "#7AC74C", label: "🌿" },
    ice: { bg: "#96D9D6", label: "❄️" },
    fighting: { bg: "#C22E28", label: "✊" },
    poison: { bg: "#A33EA1", label: "☠️" },
    ground: { bg: "#E2BF65", label: "⛰️" },
    flying: { bg: "#A98FF3", label: "🦅" },
    psychic: { bg: "#F95587", label: "👁️" },
    bug: { bg: "#A6B91A", label: "🐛" },
    rock: { bg: "#B6A136", label: "🪨" },
    ghost: { bg: "#735797", label: "👻" },
    dragon: { bg: "#6F35FC", label: "🐉" },
    dark: { bg: "#705746", label: "🌑" },
    steel: { bg: "#B7B7CE", label: "⚙️" },
    fairy: { bg: "#D685AD", label: "✨" },
  };
  const energy = energyColors[type] || { bg: "#ccc", label: "⚪" };
  return (
    <span className="tcg-type-icon" style={{ backgroundColor: energy.bg }} title={type}>
      {energy.label}
    </span>
  );
};

const Card = ({ id, name, image, types, life, attack, moves, isArena = false }) => {
  const { deck, addCard, removeCard } = useDeckStore();
  const [flavorText, setFlavorText] = useState("");
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    const collection = JSON.parse(localStorage.getItem('myCollection') || '[]');
    setIsCaptured(collection.some(p => p.id === id));
  }, [id]);

  useEffect(() => {
    let isMounted = true;
    const fetchFlavorText = async () => {
      // Only fetch if id is a PokeAPI numeric id (not a uuid from DB)
      if (id && !isNaN(parseInt(id)) && id.toString().length < 10) {
        try {
          const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
          if (isMounted) {
            // Find english flavor text
            const entry = data.flavor_text_entries.find(e => e.language.name === "en");
            if (entry) {
              setFlavorText(entry.flavor_text.replace(/[\n\f]/g, " "));
            }
          }
        } catch (error) {
          console.error("Error fetching flavor text:", error);
        }
      } else {
        setFlavorText("A custom Pokémon discovered in the Henry DB Region.");
      }
    };

    fetchFlavorText();
    return () => { isMounted = false; };
  }, [id]);

  const primaryType = types && types.length > 0 ? types[0] : "normal";
  const attackDamage1 = attack ? Math.round(attack / 2) : 10;
  const attackDamage2 = attack ? Math.round(attack / 1.5) : 20;

  const move1 = moves && moves[0] ? moves[0] : "tackle";
  const move2 = moves && moves[1] ? moves[1] : "quick attack";

  const { weakness, resistance } = typeMatchups[primaryType] || { weakness: "fighting", resistance: null };

  const isAlreadyInDeck = deck.some(c => c.id === id);

  const handleVsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAlreadyInDeck) {
      removeCard(id);
    } else {
      const currentCard = {
        id, name, type: primaryType, hp: life || 50, attackDamage: attackDamage1, weakness, resistance, image
      };
      const result = addCard(currentCard);
      // Opcional: Si devuelve 'false', el deck está lleno. Podemos manejar alertas custom aquí.
    }
  };

  const handleCaptureClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let collection = JSON.parse(localStorage.getItem('myCollection') || '[]');

    if (isCaptured) {
      collection = collection.filter(p => p.id !== id);
      setIsCaptured(false);
    } else {
      collection.push({ id, name, image, types, life, attack, moves });
      setIsCaptured(true);
    }

    localStorage.setItem('myCollection', JSON.stringify(collection));
  };

  return (
    <div
      className={`tcg-card ${attack > 80 ? 'tcg-holographic' : ''} ${isCaptured ? 'tcg-captured-card' : ''}`}
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >

      {!isArena && (
        <>
          <button
            className={`tcg-capture-btn ${isCaptured ? 'captured' : ''}`}
            onClick={handleCaptureClick}
            title={isCaptured ? "Soltar de Mi Colección" : "Capturar para Mi Colección"}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Capture Ball" />
          </button>
          <button
            className={`tcg-vs-btn ${isAlreadyInDeck ? 'active' : ''}`}
            onClick={handleVsClick}
            title={isAlreadyInDeck ? "Quitar del Mazo" : "Añadir al Mazo"}
            style={{ width: 'auto', padding: '0 8px', borderRadius: '12px' }}
          >
            {isAlreadyInDeck ? '➖ Quitar' : '➕ Deck'}
          </button>
        </>
      )}

      <div className="tcg-header">
        <h3>{name}</h3>
        <div className="tcg-hp-container">
          <span className="tcg-hp-label">HP</span>
          <span className="tcg-hp-value">{life || 50}</span>
          {getEnergyIcon(primaryType)}
        </div>
      </div>

      <div className="tcg-image-container">
        <img src={image} alt={name} />
        {/* Pokeball Watermark Sello de Captura */}
        {isCaptured && (
          <div className="tcg-captured-seal">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg" alt="Captured" />
            <span>CAPTURADO</span>
          </div>
        )}
      </div>

      <div className="tcg-moves">
        <div className="tcg-move">
          <div className="tcg-move-name">
            {getEnergyIcon("normal")} {move1}
          </div>
          <div className="tcg-move-damage">{attackDamage1}</div>
        </div>
        <div className="tcg-move">
          <div className="tcg-move-name">
            {getEnergyIcon(primaryType)} {getEnergyIcon("normal")} {move2}
          </div>
          <div className="tcg-move-damage">{attackDamage2}</div>
        </div>
      </div>

      <div className="tcg-flavor-text">
        {flavorText || "Loading data..."}
      </div>

      <div className="tcg-footer">
        <div><span>weakness</span> {weakness ? <>{getEnergyIcon(weakness)}x2</> : "N/A"}</div>
        <div><span>resistance</span> {resistance ? <>{getEnergyIcon(resistance)}-20</> : "N/A"}</div>
        <div><span>retreat cost</span> ⚪⚪</div>
      </div>
    </div>
  );
};

export default Card;
