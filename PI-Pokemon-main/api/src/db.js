require('dotenv').config();
const path = require('path');
const fs = require('fs');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;

const { Sequelize } = require('sequelize');
const modelDefiners = [];
const sequelize = new Sequelize(
   `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
   {
      logging: false,
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
      modelDefiner(sequelize);
      modelDefiners.push(modelDefiner);
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
const { Pokemon, Types } = sequelize.models;

// Definición de relaciones
Types.hasMany(Pokemon);
Pokemon.hasMany(Types);

// Exportamos los modelos y la conexión
module.exports = {
   ...sequelize.models,
   conn: sequelize,
};
