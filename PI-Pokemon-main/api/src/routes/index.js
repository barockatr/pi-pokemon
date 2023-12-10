const express = require('express');
const pokemonRouter = require('./pokemon');
const typesRouter = require('./types');
const getPokemons = require('../controllers/getPokemons'); 
const createPokemonController = require('../controllers/createPokemon');

const router = express.Router();
// Rutas
router.get('/pokemons', getPokemons.getPokemons); 
router.get('/pokemons/:idPokemon', getPokemons.getPokemonById); 
router.get('/pokemons/name', getPokemons.getPokemonByName); 

router.post('/pokemons', createPokemonController.createPokemon);

router.use('/pokemons', pokemonRouter);
router.use('/types', typesRouter);

module.exports = router;
