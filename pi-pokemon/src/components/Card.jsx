import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

const Card = ({ id, name, image, types, life, attack, moves }) => {
  const [flavorText, setFlavorText] = useState("");

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

  return (
    <Link to={`/detail/${id}`} className="tcg-card" style={{ textDecoration: 'none' }}>
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
        <div><span>weakness</span> 💧+10</div>
        <div><span>resistance</span> ⚡-20</div>
        <div><span>retreat cost</span> ⚪⚪</div>
      </div>
    </Link>
  );
};

export default Card;
