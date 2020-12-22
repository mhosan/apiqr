const { Router } = require('express') // traer una parte de express
const router = Router()
const ctrlPagPpal = require('../controladores/ctrlPagPpal')
const ctrlCobro = require('../controladores/ctrlCobro')

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
// put cobro
//---------------------------------------------------------------------
router.put('/cobro', ctrlCobro.putCobro);

module.exports = router
