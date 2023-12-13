const axios = require('axios');
const { Types } = require('../db');

const typesController = {
  getAllTypes: async (req, res) => {
    try {
      // Lógica para obtener todos los tipos de pokemones
      const apiTypes = await axios.get('https://pokeapi.co/api/v2/type');
      const apiTypeNames = apiTypes.data.results.map((type) => type.name);

      // Guardar los tipos en la base de datos si no existen
      for (const typeName of apiTypeNames) {
        await Types.findOrCreate({
          where: { name: typeName },
        });
      }

      const dbTypes = await Types.findAll();
      res.status(200).json(dbTypes);
    } catch (error) {
      console.error('Error al obtener los tipos de pokémon:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  },
};

module.exports = typesController;
