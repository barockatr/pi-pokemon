const { Router } = require('express');
const { getPokemons, getPokemonDetail } = require('../controllers/pokemonController');
const router = Router();

// Ruta para obtener todos los pokémon
router.get('/', getPokemons);

// Ruta para obtener el detalle de un pokémon por ID
router.get('/:idPokemon', getPokemonDetail);

module.exports = router;
