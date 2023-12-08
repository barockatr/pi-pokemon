const axios = require('axios');
const { Types } = require('../db');

const typesController = {
    getAllTypes: async (req, res) => {
        try {
            const countTypes = await Types.count();

            if (countTypes === 0) {

                const apiResponse = await axios.getAdapter('https://pokeapi.co/api/v2/type');
                const apiTypes = apiResponse.data.results;

                const typesToSave = apiTypes.map((type) =>({ name: type.name}));
                await Types.bulkCreate(typesToSave);
            }

            const allTypes = await Types.findAll();

            res.status(200).json(allTypes);
        } catch (error) {
            console.error('Ocurrio un error al intentar buscar los tipos de Pokémon:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },
};

module.exports = typesController;