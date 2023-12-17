require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=require`,
  {
    logging: false,
    native: false,
  }
);

const basename = path.basename(__filename);
const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models y requerimos los modelos
fs.readdirSync(path.join(__dirname, 'models'))
  .filter(
    (file) =>
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
  )
  .forEach((file) => {
    const modelDefiner = require(path.join(__dirname, 'models', file));
    modelDefiners.push(modelDefiner);
  });

// Injectamos la conexión (sequelize) a todos los modelos
modelDefiners.forEach((modelDefiner) => modelDefiner(sequelize));

// Capitalizamos los nombres de los modelos
const entries = Object.entries(sequelize.models);
const capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// Definición de las relaciones
const { Pokemon, Type } = sequelize.models;
Pokemon.belongsToMany(Type, { through: 'pokemon_type' });
Type.belongsToMany(Pokemon, { through: 'pokemon_type' });

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
