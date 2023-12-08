const { Pokemon, Types } = require('../db');

const getPokemonById = async (req, res) => {
    const { idPokemon } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(idPokemon, {
           include: Types,   
        });

        if (!pokemon) {
            return res.status(404).json({ message: 'No se encontro el Pokémon' });
        }
        
        res.status(200).json(pokemon);
    } catch (error) {
        console.error('Error al obtener el ID del pokémon:', error);
        res.status(500).json({ message: 'Error en eñ servidor' });
    }
},

module.exports = getPokemonById;