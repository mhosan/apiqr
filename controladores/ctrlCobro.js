const { Mongoose } = require('mongoose');
const cobrosEsquema = require('../modelos/cobros')
const ctrlCobro = {}

//---------------------------------------------------------------------
// probando aggregates
//---------------------------------------------------------------------
ctrlCobro.putCobroAlter = (req, res) => {
  const mail = req.body.mail;
  const nuevoEstado = req.body.estado;
  const filter = { 'receiver': mail };
  const actuEstado = { 'estado': nuevoEstado }
  cobrosEsquema.aggregate([
    { $match: { receiver: { $eq: mail } } },
    { $sort: { fechaOperacionInicio: -1 } },
    { $limit: 1 }
  ], (err, result) => {
    if (err) console.log(err)
    console.log(result[0]._id)
  })
}


//---------------------------------------------------------------------
// put del cobro por qr
//---------------------------------------------------------------------
ctrlCobro.putCobro = (req, res) => {
  let postError = "";
  if (!req.body.mail) {
    postError = postError + " El Json no trae el elemento mail.";
  }
  if (!req.body.estado) {
    postError = postError + " El Json no trae el elemento estado.";
  }
  if (!postError == "") {
    console.log(postError);
    res.status(420).json(`Error: ${postError}`);
    return;
  }
  const mail = req.body.mail;
  const nuevoEstado = req.body.estado;
  const filter = { 'receiver': mail };
  const actuEstado = { 'estado': nuevoEstado }

  cobrosEsquema.findOneAndUpdate(filter, actuEstado, { sort: { fechaOperacionInicio: -1 } }, (err, doc) => {
    if (err) {
      console.log(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
      res.status(404).json(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
    } else {
      console.log(`Actualización Ok del estado del cobro ${JSON.stringify(doc.sender)}`);
      res.status(200).json(`Actualización del estado del cobro ok!`);
    }
  })
}

//---------------------------------------------------------------------
// get del cobro por qr
//---------------------------------------------------------------------
ctrlCobro.getCobro = (req, res) => {
  const mailRecibido = req.params.mail
  cobrosEsquema.find({ receiver: mailRecibido, estado: 1 }, { _id: 0 }).sort({ fechaOperacionInicio: -1 }).limit(1).exec()
    .then(doc => {
      if (doc[0] === undefined) {
        cobrosEsquema.find({ receiver: mailRecibido }).exec()
          .then((mailBuscado) => {
            if (mailBuscado[0] === undefined) {
              console.log(`Mail recibido: ${mailRecibido}, resultado: No se encuentra ese mail.`);
              res.status(404).json(`Mail recibido: ${mailRecibido}, resultado: No se encuentra ese mail.`);
            } else {
              console.log(`Mail recibido: ${mailRecibido}, resultado: Mail no cumple condiciones.`);
              res.status(404).json(`Mail recibido: ${mailRecibido}, resultado: Mail no cumple condiciones.`);
            }
          })
          .catch(err => console.log(err));
      } else {
        console.log(`Mail recibido: ${mailRecibido}, resultado: ${doc[0]}`);
        res.status(200).json(doc[0]);
      }
    })
    .catch(err => {
      console.log(`Error: ${err}`);
      res.json(`Error ${err}`);
    })
}

//---------------------------------------------------------------------
// post del cobro por qr
//---------------------------------------------------------------------
ctrlCobro.postCobro = async (req, res) => {
  let postError = "";
  const objMontoCantElementos = req.body.objmonto.length;
  const cantidadParametros = Object.keys(req.body).length;
  if (!req.body.receiver) {
    postError = postError + " El Json no trae el elemento receiver.";
  }
  if (objMontoCantElementos === 0) {
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
  const nuevoCobro = new cobrosEsquema({
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
