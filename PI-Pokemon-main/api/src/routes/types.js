const { Router } = require('express');
const typesController = require('../controllers/types')

const router = Router();

router.get('/', typesController.getAllTypes);

module.exports = router;