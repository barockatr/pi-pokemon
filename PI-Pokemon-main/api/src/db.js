require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { DataTypes } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const PokemonModel = require('./models/Pokemon');
const TypeModel = require('./models/Types');
const { Sequelize } = require('sequelize');

const modelDefiners = [];
const sequelize = new Sequelize(
   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
   {
      logging: console.log,
      native: false,
   }
);

// Leemos todos los archivos de la carpeta Models y los requerimos
fs.readdirSync(path.join(__dirname, '/models'))
   .filter(
      (file) =>
         file.indexOf('.') !== 0 &&
         file.slice(-3) === '.js'
   )
   .forEach((file) => {
      const modelDefiner = require(path.join(__dirname, '/models', file));
      modelDefiners.push(modelDefiner);
   });

// Dentro del bucle que carga modelos
modelDefiners.forEach((modelDefiner) => {
   try {
      // Invocar la función de modelo y obtener el modelo resultante
      const model = modelDefiner(sequelize);

      // Imprimir mensaje de éxito
      console.log(`Modelo cargado correctamente: ${model.name}`);
   } catch (error) {
      // Imprimir mensaje de error
      console.error(`Error al cargar el modelo ${modelDefiner.name}:`, error);
   }
});

// Capitalizamos los nombres de los modelos (puedes hacerlo después de cargar los modelos)
modelDefiners.forEach((model) => model(sequelize));
const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
   entry[0][0].toUpperCase() + entry[0].slice(1),
   entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Destructuring para obtener los modelos
const Pokemon = PokemonModel(sequelize, Sequelize);
const Type = TypeModel(sequelize, Sequelize);

// Definición de relaciones
Pokemon.belongsToMany(Type, { through: 'Type_Pokemon' });
Type.belongsToMany(Pokemon, { through: 'Type_Pokemon' });

// Exportamos los modelos y la conexión
module.exports = {
   ...sequelize.models,
   conn: sequelize,
   Pokemon,
   Type,
};
