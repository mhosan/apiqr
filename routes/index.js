const { Router } = require('express'); // traer una parte de express
const router = Router();
const ctrlPagPpal = require('../controladores/ctrlPagPpal');
const ctrlCobro = require('../controladores/ctrlCobro');
const ctrlPago = require('../controladores/ctrlPago');

// ---------------------------------------------------------------------
// pagina principal de adm del servidor. Esta página probablemente
// desaparezca
// ---------------------------------------------------------------------
router.get('/', ctrlPagPpal.getCobros);

// ---------------------------------------------------------------------
// post cobro
// ---------------------------------------------------------------------
router.post('/cobro', ctrlCobro.postCobro);

//---------------------------------------------------------------------
// get cobro
//---------------------------------------------------------------------
router.get('/cobro/:mail', ctrlCobro.getCobro);

//---------------------------------------------------------------------
// get pago
//---------------------------------------------------------------------
router.get('/pago/:mail', ctrlPago.getPago);

//---------------------------------------------------------------------
// put cobro
//---------------------------------------------------------------------
router.put('/cobro', ctrlCobro.putCobro);

//---------------------------------------------------------------------
// put pago
//---------------------------------------------------------------------
router.put('/pago', ctrlPago.putCobro);
module.exports = router
