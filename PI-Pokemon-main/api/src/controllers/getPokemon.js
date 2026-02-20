const axios = require('axios');
const { Pokemon, Type } = require('../db.js');

const getPokemons = async (req, res) => {
    try {
        // Fetch from Database
        const dbPokemons = await Pokemon.findAll({
            include: {
                model: Type,
                attributes: ['name'],
                through: { attributes: [] }
            },
        });

        const formattedDbPokemons = dbPokemons.map(p => ({
            ...p.toJSON(),
            types: p.Types?.map(t => t.name) || p.types // Normalize types
        }));

        // Fetch from PokeAPI
        const apiResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=40');
        const apiPokemonsPromises = apiResponse.data.results.map(p => axios.get(p.url));
        const apiPokemonsData = await Promise.all(apiPokemonsPromises);

        const apiPokemons = apiPokemonsData.map(res => {
            const p = res.data;
            return {
                id: p.id,
                name: p.name,
                image: p.sprites.other['official-artwork'].front_default,
                life: p.stats[0].base_stat,
                attack: p.stats[1].base_stat,
                defense: p.stats[2].base_stat,
                speed: p.stats[5].base_stat,
                height: p.height,
                weight: p.weight,
                types: p.types.map(t => t.type.name),
                moves: p.moves.slice(0, 2).map(m => m.move.name),
                created: false
            };
        });

        res.status(200).json([...formattedDbPokemons, ...apiPokemons]);
    } catch (error) {
        console.error('No se pudieron obtener los pokémons:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = getPokemons;
