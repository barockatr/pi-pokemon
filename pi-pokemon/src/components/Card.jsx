import React from "react";
import Card from "./Card"; // Asegúrate de tener la importación correcta

const HomePage = () => {
  // Supongamos que tienes identificadores únicos para cada Pokémon
  const pokemonData = [
    { id: 1, name: "Pikachu", image: require("./pikachu.jpg"), types: ["Electric"] },
    { id: 2, name: "Charizard", image: require("./charizard.jpg"), types: ["Fire", "Flying"] },
    // Más datos de Pokémon...
  ];

  return (
    <div>
      {pokemonData.map((pokemon) => (
        <Card
          key={pokemon.id} // Utiliza identificadores únicos como clave
          name={pokemon.name}
          image={pokemon.image}
          types={pokemon.types}
        />
      ))}
    </div>
  );
};

export default HomePage;
