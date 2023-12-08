const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');
const createPokemonController = require('../controllers/createPokemon');

router.get('/', pokemonController.getPokemons);
router.get('/:idPokemon', pokemonController.getPokemonById);
router.get('/name', pokemonController.getPokemonByName);

router.post('/', createPokemonController.createPokemon);

module.exports = router;