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
// COBRO post 
// ---------------------------------------------------------------------
router.post('/cobro', ctrlCobro.postCobro);

//---------------------------------------------------------------------
// COBRO get
//---------------------------------------------------------------------
router.get('/cobro/:mail', ctrlCobro.getCobro);

//---------------------------------------------------------------------
// COBRO put 
//---------------------------------------------------------------------
router.put('/cobro', ctrlCobro.putCobro);

//---------------------------------------------------------------------
// COBRO put para cancelar 
//---------------------------------------------------------------------
router.put('/cobro/cancelar', ctrlCobro.putCancelar);

//---------------------------------------------------------------------
// PAGO get
//---------------------------------------------------------------------
router.get('/pago/:mail', ctrlPago.getPago);

//---------------------------------------------------------------------
// PAGO put
//---------------------------------------------------------------------
router.put('/pago', ctrlPago.putPago);

module.exports = router
