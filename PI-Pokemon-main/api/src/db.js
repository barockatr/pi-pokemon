require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// 🗄️ SQLite: Base de datos portátil en archivo .sqlite (sin PostgreSQL)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

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
