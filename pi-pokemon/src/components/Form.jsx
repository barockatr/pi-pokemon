import React, { useState } from "react";

const Form = () => {
  const [pokemon, setPokemon] = useState({});
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate the data (example: checking if numeric fields are valid numbers)
      if (isNaN(Number(pokemon.hp)) || isNaN(Number(pokemon.attack))) {
        throw new Error("Numeric fields must be valid numbers");
      }

      // Send the pokemon data to the API
      const response = await fetch("http://localhost:3001/pokemons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...pokemon,
          name: pokemon.name.toLowerCase()
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create the Pokemon");
      }
      alert('Pokemon created successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={pokemon.name || ""}
        onChange={(event) => setPokemon({ ...pokemon, name: event.target.value })}
      />
      <input
        type="text"
        placeholder="Image"
        value={pokemon.image || ""}
        onChange={(event) => setPokemon({ ...pokemon, image: event.target.value })}
      />
      <input
        type="number"
        placeholder="HP"
        value={pokemon.hp || ""}
        onChange={(event) => setPokemon({ ...pokemon, hp: event.target.value })}
      />
      <input
        type="number"
        placeholder="Attack"
        value={pokemon.attack || ""}
        onChange={(event) => setPokemon({ ...pokemon, attack: event.target.value })}
      />
      <input
        type="number"
        placeholder="Defense"
        value={pokemon.defense || ""}
        onChange={(event) => setPokemon({ ...pokemon, defense: event.target.value })}
      />
      <input
        type="number"
        placeholder="Speed"
        value={pokemon.speed || ""}
        onChange={(event) => setPokemon({ ...pokemon, speed: event.target.value })}
      />
      <input
        type="number"
        placeholder="Height"
        value={pokemon.height || ""}
        onChange={(event) => setPokemon({ ...pokemon, height: event.target.value })}
      />
      <input
        type="number"
        placeholder="Weight"
        value={pokemon.weight || ""}
        onChange={(event) => setPokemon({ ...pokemon, weight: event.target.value })}
      />
      <button type="submit">Create</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Form;
