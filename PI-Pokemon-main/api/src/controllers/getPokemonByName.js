const axios = require('axios');
const { Pokemon, Type } = require('../db');
const { Op } = require('sequelize');

const getPokemonByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: 'Debe proporcionar el nombre de un Pokémon' });
    }

    const lowerName = name.toLowerCase();

    try {
        // Search in DB
        const dbPokemons = await Pokemon.findAll({
            where: {
                name: {
                    [Op.like]: `%${lowerName}%`,
                },
            },
            include: {
                model: Type,
                attributes: ['name'],
                through: { attributes: [] }
            },
        });

        const formattedDb = dbPokemons.map(p => ({
            ...p.toJSON(),
            types: p.Types?.map(t => t.name) || p.types
        }));

        // Search in PokeAPI (only if exact match or if we want to search API results too)
        // Usually, for PI, we search exact match in API.
        try {
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${lowerName}`);
            if (data) {
                const apiPokemon = {
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
                    moves: data.moves.slice(0, 2).map(m => m.move.name),
                    created: false
                };

                // Avoid duplicates if DB already found it (though DB ones usually have UUIDs)
                return res.status(200).json([...formattedDb, apiPokemon]);
            }
        } catch (apiError) {
            // If not found in API, just return DB results
            if (formattedDb.length > 0) {
                return res.status(200).json(formattedDb);
            }
            return res.status(404).json({ message: 'No existe un Pokémon con ese nombre' });
        }

        res.status(200).json(formattedDb);
    } catch (error) {
        console.error('Error al buscar Pokémon por nombre:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = getPokemonByName;