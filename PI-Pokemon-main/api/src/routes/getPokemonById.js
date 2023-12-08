const { Router } = require('express');
const getPokemonById = require('../controllers/getPokemonById');

const router = Router();

router.get('/pokemons/:idPokemon', getPokemonById);

module.exports = router;