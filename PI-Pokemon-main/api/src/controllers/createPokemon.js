const { Pokemon, Type } = require('../db');

const createPokemonController = async (req, res) => {
    const {
        name,
        image,
        life,
        attack,
        defense,
        speed,
        height,
        weight,
        types,
    } = req.body;

    try {
        const existingPokemon = await Pokemon.findOne({
            where: { name },
        });

        if (existingPokemon) {
            return res.status(400).json({ message: 'Ya existe un Pokémon con ese nombre' });
        }

        const createPokemon = await Pokemon.create({
            name,
            image,
            life,
            attack,
            defense,
            speed,
            height,
            weight,
        });

        if (types && types.length) {
            await createPokemon.addTypes(types);
        }

        res.status(201).json(createPokemon);
    } catch (error) {
        console.error('Error al crear el Pokémon:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = createPokemonController;