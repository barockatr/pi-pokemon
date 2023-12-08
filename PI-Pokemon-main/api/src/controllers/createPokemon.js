const { Pokemon, Types } = require('../db');

const createPokemonController = async (req, res) => {
    const {
        name,
        image,
        life,
        attack,
        defense,
        speed,
        heigth,
        weight,
        types,
    } = req.body;

    try {
        const existingPokemon = await Pokemon.findOne({
            where: { name },
        });

        if (existingPokemon) {
            return res.status(400).json({ message: 'Ya existe un Pokémon con ese nombre'});
        }

        const createPokemon = await Pokemon.create({
            name,
            image,
            life,
            attack,
            defense,
            speed,
            heigth,
            weight, 
        });

        await created.addTypes(types);

        res.status(201).json(createPokemon);
    } catch (error) {
        console.error('Error al crear el Pokémon');
        res.status(500).json({ message: 'Error en el servidor'});
    } 
};

module.exports = createPokemonController;