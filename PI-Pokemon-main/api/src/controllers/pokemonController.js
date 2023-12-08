const { Pokemon, Types } = require('../db');

const pokemonController = {
    getPokemons: async (req, res) => {
        try {
            const pokemons = await Pokemon.findAll ({
                include: Types,
            });

            res.status(200).json(pokemons);
        } catch (error) {
            console.error('No se pudieron obtener los pokémons:', error);
            res.status(500).json({ message: 'Error en el servidor'});
        }
    },

    getPokemonById: async (req, res) => {
        const { idPokemon } = req.params;

        try {
            const pokemon = await Pokemon.findByPk(idPokemon, {
               include: Types,   
            });

            if (!pokemon) {
                return res.status(404).json({ meddage: 'No se econtro el Pokémon' });
            }
            
            res.status(200).json(pokemon);
        } catch (error) {
            console.error('Error al obtener el pokémon:', error);
            res.status(500).json({ message: 'Error del servidor' });
        }
    },
};

module.exports = pokemonController;