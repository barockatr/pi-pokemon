const { Router } = require('express');
const { getPokemons } =('../controllers/getPokemon.js');
const router = Router();

router.get('/', async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll();

        res.json(pokemons);        
    } catch (error) {
        console.error('No se pudieron obtener los Pokemon:', error);
        res.status(500).json({ error: 'Error en el servidor'});
    }
});

module.exports = router; 