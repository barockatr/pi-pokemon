import React, { useState, useEffect } from "react";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const pokemonId = 1; // Reemplaza con el ID del Pokémon que deseas cargar

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        setPokemon(data);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el Pokémon:", error);
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!pokemon) {
    return <p>No se pudo cargar el Pokémon</p>;
  }

  return (
    <div>
      <h1>{pokemon.name}</h1>
      <img src={`https://pokeapi.co/media/sprites/pokemon/${pokemonId}.png`} alt={pokemon.name} />
      <ul>
        <li>ID: {pokemon.id}</li>
        <li>Nombre: {pokemon.name}</li>
        <li>Vida: {pokemon.stats[0].base_stat}</li>
        <li>Ataque: {pokemon.stats[1].base_stat}</li>
        <li>Defensa: {pokemon.stats[2].base_stat}</li>
        <li>Velocidad: {pokemon.stats[5].base_stat}</li>
        <li>Altura: {pokemon.height}</li>
        <li>Peso: {pokemon.weight}</li>
        <li>Tipo: {pokemon.types.map((type) => type.type.name).join(", ")}</li>
      </ul>
    </div>
  );
};

export default DetailPage;
