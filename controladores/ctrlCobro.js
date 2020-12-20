const qrEsquema = require('../modelos/qr')
const ctrlCobro = {}

//---------------------------------------------------------------------
// post del cobro por qr
//---------------------------------------------------------------------
ctrlCobro.postCobro = async (req, res) => {
  let postError = "";
  const objMontoCant = req.body.objmonto.length;
  const cantidadParametros = Object.keys(req.body).length;
  if (!req.body.receiver) {
    postError = postError + " El Json no trae el elemento receiver.";
  }
  if (objMontoCant === 0) {
    postError = postError + " El Json no trae el elemento objmonto.";
  } else {
    if (!req.body.objmonto[0].monto) {
      postError = postError + " El Json no trae el elemento monto.";
    }
    if (!req.body.objmonto[0].tipoTransaccion) {
      postError = postError + " El Json no trae el elemento tipoTransaccion.";
    }
  }
  if (!req.body.estado) {
    postError = postError + " El Json no trae el elemento estado.";
  }
  if (!postError == "") {
    console.log(postError);
    res.status(420).json(`Error: ${postError}`);
    return;
  }
  let objMontoRecibido = [];
  req.body.objmonto.forEach(element => {
    const objetoMonto = {
      monto: element.monto,
      tipoTransaccion: element.tipoTransaccion
    };
    objMontoRecibido.push(objetoMonto);
  });
  const nuevoCobro = new qrEsquema({
    receiver: req.body.receiver,
    objmonto: objMontoRecibido,
    estado: req.body.estado,
    sender: req.body.sender,
    fechaOperacionInicio: new Date(),
    fechaOperacionFinal: null
  });
  nuevoCobro.save()
    .then(doc => {
      console.log(`El registro de cobro se guardó ok!`);
      res.status(201).json('El registro se persistió en la db ok!');
    })
    .catch(err => {
      console.log(`Error al guardar el registro de cobro: ${err}`);
      res.status(400).json(`El registro no se guardó en la db: ${err}`);
    })
}

module.exports = ctrlCobro
