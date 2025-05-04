const express = require('express');
const router = express.Router();

const taxiController = require('../controllers/taxiController');
const conductorController = require('../controllers/conductorController');
const precioController = require('../controllers/precioController');
const turnoController = require('../controllers/turnoController');
router.post('/taxi', taxiController.createTaxi);
router.get('/taxi', taxiController.getTaxis);

router.post('/conductor', conductorController.createConductor);
router.get('/conductor', conductorController.getConductores);
router.get('/conductor/:nif', conductorController.getConductorNIF);


router.post('/precios', precioController.crearOActualizarPrecio);
router.get('/precios', precioController.getPrecios);
router.post('/precios/simular', precioController.simularPrecio);

router.get('/turno', turnoController.getTurnos);
router.get('/turno/:nif', turnoController.getTurnoConductor);
router.post('/turno', turnoController.createTurno);
module.exports = router;
