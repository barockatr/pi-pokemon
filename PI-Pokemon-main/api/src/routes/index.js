const express = require('express');
const typesRouter = require('./types');
const getPokemons = require('../controllers/getPokemon');
const getHandlers = require('../handlers/gethandlers');
const createPokemonController = require('../controllers/createPokemon');

const router = express.Router();
// Rutas
router.use('/pokemons', pokemonRouter);

router.get('/pokemons', getPokemons.getPokemons); 
router.get('/pokemons/:idPokemon', getPokemons.getPokemonById); 
router.get('/pokemons/name/:pokemonName', getPokemons.getPokemonByName); 

router.post('/pokemons', createPokemonController.createPokemon);

router.use('/pokemons', pokemonRouter);
router.use('/types', typesRouter);

module.exports = router;
