const express = require('express');
const router = express.Router();
const taxiController = require('../controllers/taxiController');
const motoristaController = require('../controllers/motoristaController');

//Taxi
router.post('/taxi', taxiController.createTaxi);

router.get('/taxi', taxiController.getTaxis);

//Motoristas
router.post('/motorista', motoristaController.createMotorista);

router.get('/motorista', motoristaController.getMotoristas);

module.exports = router;