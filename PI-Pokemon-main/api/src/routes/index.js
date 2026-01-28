const { Router } = require('express');
const getPokemons = require('../controllers/getPokemon');
const getPokemonById = require('../controllers/getPokemonById');
const getPokemonByName = require('../controllers/getPokemonByName');
const createPokemon = require('../controllers/createPokemon');
const typesController = require('../controllers/types');

const router = Router();

router.get('/pokemons', (req, res) => {
    if (req.query.name) {
        return getPokemonByName(req, res);
    }
    return getPokemons(req, res);
});

router.get('/pokemons/:idPokemon', getPokemonById);

router.post('/pokemons', createPokemon);

router.get('/types', typesController.getAllTypes);

module.exports = router;
