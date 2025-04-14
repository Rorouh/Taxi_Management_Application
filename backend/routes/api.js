const express = require('express');
const router = express.Router();
const taxiController = require('../controllers/taxiController');


router.post('/', taxiController.createTaxi);

router.get('/', taxiController.getTaxis);
