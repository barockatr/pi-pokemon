const axios = require('axios');
const { Pokemon, Type } = require('../db');

const getPokemonById = async (req, res) => {
    const { idPokemon } = req.params;

    try {
        if (isNaN(idPokemon)) {
            // Search in DB (UUID)
            const pokemon = await Pokemon.findByPk(idPokemon, {
                include: {
                    model: Type,
                    attributes: ['name'],
                    through: { attributes: [] }
                },
            });

            if (!pokemon) {
                return res.status(404).json({ message: 'No se encontro el Pokémon en la DB' });
            }

            const formatted = {
                ...pokemon.toJSON(),
                types: pokemon.Types?.map(t => t.name) || pokemon.types
            };
            return res.status(200).json(formatted);
        } else {
            // Search in PokeAPI
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`);
            const pokemon = {
                id: data.id,
                name: data.name,
                image: data.sprites.other['official-artwork'].front_default,
                life: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                speed: data.stats[5].base_stat,
                height: data.height,
                weight: data.weight,
                types: data.types.map(t => t.type.name),
                created: false
            };
            return res.status(200).json(pokemon);
        }
    } catch (error) {
        console.error('Error al obtener el ID del pokémon:', error);
        res.status(500).json({ message: 'Error en el servidor o Pokémon no encontrado' });
    }
};

module.exports = getPokemonById;