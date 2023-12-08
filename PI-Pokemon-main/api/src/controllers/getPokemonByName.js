const {Pokemon, Types, Sequelize } = require('../db');

const getPokemonByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Debe proporcionar el nombre de un Pokémon' });
    }

    try {
        const pokemons = await Pokemon.findAll({
            where: {
                name : {
                    [Sequelize.Op.iLike]: `%${name}%`,
                },
            },
            include: Types,
        });

        if (pokemons.length === 0) {
            return res.status(404).json({ message: 'No existe un Pokémon con ese nombre'});
        }

        res.status(200).json(pokemons);
    } catch (error) {
        console.error('Error al buscar Pokémon por nombre:', error);
        res.status(500).json({ message: 'Error en el servidor'});
    }

};

module.exports = getPokemonByName;