import React, { useState } from "react";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState(null);

  const fetchPokemon = async () => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    setPokemon(data);
  };

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.image} alt={pokemon.name} />
      <ul>
        <li>ID: {pokemon.id}</li>
        <li>Nombre: {pokemon.name}</li>
        <li>Imagen: {pokemon.image}</li>
        <li>Vida: {pokemon.hp}</li>
        <li>Ataque: {pokemon.attack}</li>
        <li>Defensa: {pokemon.defense}</li>
        <li>Velocidad: {pokemon.speed}</li>
        <li>Altura: {pokemon.height}</li>
        <li>Peso: {pokemon.weight}</li>
        <li>Tipo: {pokemon.type}</li>
      </ul>
    </div>
  );
};

export default DetailPage;