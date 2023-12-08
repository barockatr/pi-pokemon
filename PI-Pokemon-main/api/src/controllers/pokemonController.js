const { Pokemon, Types, Sequelize } = require('../db');

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
};

module.exports = pokemonController;