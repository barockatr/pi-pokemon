import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

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
    return <p>Cargando...</p>;
  }

  if (!pokemon) {
    return (
      <div>
        <p>No se pudo cargar el Pokémon</p>
        <Link to="/home">Volver</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/home">Volver</Link>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.image} alt={pokemon.name} />
      <ul>
        <li>ID: {pokemon.id}</li>
        <li>Nombre: {pokemon.name}</li>
        <li>Vida: {pokemon.life}</li>
        <li>Ataque: {pokemon.attack}</li>
        <li>Defensa: {pokemon.defense}</li>
        <li>Velocidad: {pokemon.speed}</li>
        <li>Altura: {pokemon.height}</li>
        <li>Peso: {pokemon.weight}</li>
        <li>Tipo: {pokemon.types?.join(", ")}</li>
      </ul>
    </div>
  );
};

export default DetailPage;
