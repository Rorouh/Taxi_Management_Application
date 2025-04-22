const express = require('express');
const router  = express.Router();

// importa los routers correctos
const taxiRouter      = require('./taxiRoutes');
const conductorRouter = require('./conductorRoutes');
const precioRouter    = require('./precioRoutes');

router.use('/taxis',      taxiRouter);
router.use('/conductores',conductorRouter);
router.use('/precios',    precioRouter);

module.exports = router;