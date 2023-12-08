const express = require('express');
const pokemonRouter = require('./pokemon');
const typesRouter = require('./types');
const pokemonController = require('../controllers/pokemonController');
const createPokemonController = require('../controllers/createPokemon');

const router = express.Router();
// Rutas
router.get('/pokemons', pokemonController.getPokemons);
router.get('/pokemons/:idPokemon', pokemonController.getPokemonById);
router.get('/pokemons/name', pokemonController.getPokemonByName);

router.post('/pokemons', createPokemonController.createPokemon);

router.use('/pokemons', pokemonRouter);
router.use('/types', typesRouter);

module.exports = router;
