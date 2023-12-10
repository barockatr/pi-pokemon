const express = require('express');
const router = express.Router();
const getPokemons = require('../controllers/getPokemons'); 
const createPokemonController = require('../controllers/createPokemon');

router.get('/', getPokemons); 
router.get('/:idPokemon', getPokemons); 
router.get('/name', getPokemons); 

router.post('/', createPokemonController.createPokemon);

module.exports = router;
