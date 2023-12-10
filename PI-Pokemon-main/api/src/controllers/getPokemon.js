const { Pokemon, Types } = require('../db.js');

const getPokemons = async (req, res) => {
    try {
        const limit = 100;
        const pokemons = await Pokemon.findAll({
            limit,
            include: {
                model: Types,
                attributes: ['name'], // especifica las columnas que deseas obtener
            },
        });

        res.status(200).json(pokemons);
    } catch (error) {
        console.error('No se pudieron obtener los pokémons:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = getPokemons;
