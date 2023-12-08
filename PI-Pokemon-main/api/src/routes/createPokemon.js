const { Router } = require('express');
const createPokemonController = require('../controllers/createPokemon');

const router = Router();

router.post('/pokemons', createPokemonController);

module.exports = router;