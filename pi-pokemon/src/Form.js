import React, { useState } from "react";

const Form = () => {
  const [pokemon, setPokemon] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send the pokemon data to the API
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={pokemon.name}
        onChange={(event) => setPokemon({ ...pokemon, name: event.target.value })}
      />
      <input
        type="text"
        placeholder="Imagen"
        value={pokemon.image}
        onChange={(event) => setPokemon({ ...pokemon, image: event.target.value })}
      />
      <input
        type="number"
        placeholder="Vida"
        value={pokemon.hp}
        onChange={(event) => setPokemon({ ...pokemon, hp: event.target.value })}
      />
      <input
        type="number"
        placeholder="Ataque"
        value={pokemon.attack}
        onChange={(event) => setPokemon({ ...pokemon, attack: event.target.value })}
      />
      <input
        type="number"
        placeholder="Defensa"
        value={pokemon.defense}
        onChange={(event) => setPokemon({ ...pokemon, defense: event.target.value })}
      />
      <input
        type="number"
        placeholder="Velocidad"
        value={pokemon.speed}
        onChange={(event) => setPokemon({ ...pokemon, speed: event.target.value })}
      />
      <input
        type="number"
        placeholder="Altura"
        value={pokemon.height}
        onChange={(event) => setPokemon({ ...pokemon, height: event.target.value })}
      />
      <input
        type="number"
        placeholder="Peso"
        value={pokemon.weight}
        onChange={(event) => setPokemon({ ...pokemon, weight: event.target.value })}
      />
      <button type="submit">Crear</button>
    </form>
  );
};

export default Form;