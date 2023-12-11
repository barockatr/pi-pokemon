// getHandlers.js

const axios = require('axios');
const { Op } = require('sequelize');
const { Pokemon, Types } = require('../db.js');
const { Type } = require('../db');

const getHandlers = {
  getPokemons: async (req, res) => {
    try {
      // Lógica para obtener información detallada de los pokemons de la API
      const apiPokemons = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
      const apiResults = apiPokemons.data.results;
      const apiPokemonsInfo = await Promise.all(apiResults.map(async (pokemon) => {
        const apiPokemonData = await axios.get(pokemon.url);
        return {
          id: apiPokemonData.data.id,
          name: apiPokemonData.data.name,
          hp: apiPokemonData.data.stats[0].base_stat,
          attack: apiPokemonData.data.stats[1].base_stat,
          defense: apiPokemonData.data.stats[2].base_stat,
          speed: apiPokemonData.data.stats[5].base_stat,
          height: apiPokemonData.data.height,
          weight: apiPokemonData.data.weight,
          image: apiPokemonData.data.sprites.front_default,
          types: apiPokemonData.data.types.map((elem) => {
            return {
              id: elem.slot,
              name: elem.type.name,
            };
          }),
        };
      }));

      // Lógica para obtener información de los pokemons de la base de datos
      const dbPokemons = await Pokemon.findAll({
        include: {
          model: Types,
          attributes: ['name'],
        },
      });

      const allPokemons = [...apiPokemonsInfo, ...dbPokemons];
      res.status(200).json(allPokemons);
    } catch (error) {
      console.error('Error al obtener los pokémons:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  getPokemonById: async (req, res) => {
    try {
      // Lógica para obtener un Pokémon por ID
      const { idPokemon } = req.params;
      const pokemon = await Pokemon.findByPk(idPokemon, {
        include: {
          model: Types,
          attributes: ['name'],
        },
      });

      if (!pokemon) {
        return res.status(404).json({ message: 'Pokémon no encontrado' });
      }

      res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error al obtener el Pokémon por ID:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  getPokemonByName: async (req, res) => {
    try {
      // Lógica para obtener un Pokémon por nombre
      const { name } = req.query;
      const pokemon = await Pokemon.findAll({
        where: {
          name: { [Op.iLike]: `%${name}%` }, // Case-insensitive search
        },
        include: {
          model: Types,
          attributes: ['name'],
        },
      });

      if (!pokemon || pokemon.length === 0) {
        return res.status(404).json({ message: 'Pokémon no encontrado' });
      }

      res.status(200).json(pokemon);
    } catch (error) {
      console.error('Error al obtener el Pokémon por nombre:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // Otros handlers para obtener información adicional

  getTypes: async (req, res) => {
    try {
      // Lógica para obtener todos los tipos de pokemones
      const apiTypes = await axios.get('https://pokeapi.co/api/v2/type');
      const apiTypeNames = apiTypes.data.results.map((type) => type.name);

      // Guardar los tipos en la base de datos si no existen
      for (const typeName of apiTypeNames) {
        await Types.findOrCreate({
          where: { name: typeName },
        });
      }

      const dbTypes = await Types.findAll();
      res.status(200).json(dbTypes);
    } catch (error) {
      console.error('Error al obtener los tipos de pokémon:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },

  // ... (otros handlers)
};

module.exports = getHandlers;
