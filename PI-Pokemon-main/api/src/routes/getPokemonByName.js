const { Router } = require('express');
const getPokemonByName = require('../controllers/getPokemonByName');

const router = Router();

router.get('/pokemons/name', getPokemonByName);

module.exports = router;