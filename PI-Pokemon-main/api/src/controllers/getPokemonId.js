const { Pokemon, Type } = require('../db');

const getPokemonDetail = async (req, res) => {
    const { idPokemon } = req.params;

    try {
        const pokemonDetail = await Pokemon.findByPk(idPokemon, {
            include: Type,
    });

    if (!pokemonDetail) {
        return res.status(404).json({ error: 'No se encontro el Pokémon' });
    }

    res.json(pokemonDetail);
 } catch (error) {
    console.error('Hubo un error para obtener el detalle del Pokémon:', error);
    res.status(500).json({ error: 'Error en el servidor'});
 }
};

module.exports = {
    getPokemonDetail,
};