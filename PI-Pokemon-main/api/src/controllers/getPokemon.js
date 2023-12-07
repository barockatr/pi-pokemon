const { Pokemon } = require('../db');

const getPokemons = async (req, res) => {
  try {
    const pokemons = await Pokemon.findAll();
    res.json(pokemons);
  } catch (error) {
    console.error('Error al obtener los Pokémon:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getPokemons,
};
