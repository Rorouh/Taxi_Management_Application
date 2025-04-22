const express = require('express');
const router = express.Router();

const taxiController = require('../controllers/taxiController');
const conductorController = require('../controllers/conductorController');
const precioController = require('../controllers/precioController');

router.post('/taxi', taxiController.createTaxi);
router.get('/taxi', taxiController.getTaxis);

router.post('/conductor', conductorController.createConductor);
router.get('/conductor', conductorController.getConductores);

router.post('/precios', precioController.crearOActualizarPrecio);
router.get('/precios', precioController.getPrecios);
router.post('/precios/simular', precioController.simularPrecio);

module.exports = router;
