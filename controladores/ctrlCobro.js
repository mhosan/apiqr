const { Mongoose } = require('mongoose');
const cobros = require('../modelos/cobros');
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
// verificar el mail
//---------------------------------------------------------------------
const verificarMail = (mailVerificar) => {
  return new Promise((resolve, reject) => {
    cobrosEsquema.find({ receiver: mailVerificar }, (err, res) => {
      if (err) reject('error en la busqueda del mail')
      if (res.length === 0) {
        resolve(false);
      } else {
        resolve(true)
      }
    })
  })
}

//---------------------------------------------------------------------
// verificar el objeto monto
//---------------------------------------------------------------------
const verificarObjMonto = (objetoMontoVerificar) => {
  let verificacion = "";
  return new Promise((resolve, reject) => {
    const objMontoCantElementos = objetoMontoVerificar.length;
    if (!objMontoCantElementos === 0) {
      objetoMontoVerificar.forEach(elementoObjMonto => {
        if (!elementoObjMonto.monto) {
          console.log("El objmonto no tiene el elemento monto.");
          verificacion = "El objmonto no tiene el elemento monto.";
        }
        if (!elementoObjMonto.tipoTransaccion) {
          console.log("El objmonto no trae el elemento tipoTransaccion.");
          verificacion = "El objmonto no trae el elemento tipoTransaccion.";
        }
      })
    }
    let objMontoActual = [];
    if (Array.isArray(objetoMontoVerificar) && objetoMontoVerificar.length) {  //<--el objeto objmonto no está vacio
      verificacion = 'ok';
      // req.body.objmonto.forEach(element => {
      //   const objetoMonto = {
      //     monto: element.monto,
      //     tipoTransaccion: element.tipoTransaccion
      //   };
      //   objMontoActual.push(objetoMonto);
      // });
    } else {
      //console.log(`El objeto monto esta vacio`);
      verificacion = "El objeto monto esta vacio";
    }
    if (verificacion === 'ok') {
      resolve(verificacion)
    } else {
      reject(verificacion)
    }
  })
}

//---------------------------------------------------------------------
// ejecutar la query (put) de actualización una vez verificados 
// todos los parametros (mail y objmonto)
//---------------------------------------------------------------------
const ejecutarPut = (mailRecibido, objetoMontoRecibido) => {
  return new Promise((resolve, reject) => {
    const filter = { 'receiver': mailRecibido, 'estado': 1 };
    const actuObjMonto = { 'objmonto': objetoMontoRecibido }
    cobrosEsquema.findOneAndUpdate(filter, actuObjMonto, { sort: { fechaOperacionInicio: -1 } }, (err, doc) => {
      if (err) {
        //console.log(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
        reject('Error al actualizar el estado del cobro');
      } else {
        //console.log(doc);
        resolve(doc);
      }
    })
  })
}

//---------------------------------------------------------------------
// put del cobro por qr. Recibe dos parametros: mail receiver y objmonto.
// y actualiza solamente objmonto. No actualiza estado.
//---------------------------------------------------------------------
ctrlCobro.putCobro = (req, res) => {
  if (!req.body.mail) {
    console.log(" El Json no trae el elemento mail.");
    res.status(404).json(`Error: falta el mail`);
    return;
  }
  if (!req.body.objmonto) {
    console.log("El json no trae el objeto objmonto")
    res.status(404).json('Error: falta el objeto objmonto');
    return;
  }
  verificarMail(req.body.mail)
    .then(respuesta => {
      if (respuesta) {
        console.log('mail verificado ok!')
        verificarObjMonto(req.body.objmonto)
          .then(respuestaVerifMonto => {
            console.log(`monto verif. ok: ${respuestaVerifMonto}`);
            ejecutarPut(req.body.mail, req.body.objmonto)
              .then(resultadoQuery => {
                if(resultadoQuery === null){
                  res.status(200).json(`No se actualizó ningún registro. Verificar que estado = pendiente`);
                } else {
                  res.status(200).json('Actualización ok!')
                }
              })
              .catch(err => {
                console.log(`error: ${err}`);
                res.status(404).json(`Error al actualizar el estado del cobro del mail`);
              })
          })
          .catch(err => {
            console.log(`error al verificar el monto: ${err}`);
            res.status(404).json(`Error con el objmonto: ${err}`);
          })
      } else {
        console.log('El mail no se encuentra en la bd');
        res.status(404).json('El mail no se encuentra en la bd')
        return;
      }
    })
    .catch(err => {
      console.log('error en la verificacion del mail')
    })
}



//---------------------------------------------------------------------
// get del cobro por qr
//---------------------------------------------------------------------
ctrlCobro.getCobro = (req, res) => {
  const mailRecibido = req.params.mail
  //cobrosEsquema.find({ receiver: mailRecibido, estado: 1 }, { _id: 0 }).sort({ fechaOperacionInicio: -1 }).limit(1).exec()
  cobrosEsquema.find({ receiver: mailRecibido, estado: 1 }).sort({ fechaOperacionInicio: -1 }).limit(1).exec()
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
  let objMontoRecibido = [];
  const objMontoCantElementos = req.body.objmonto.length;
  if (!req.body.receiver) {
    postError = postError + " El Json no trae el elemento receiver.";
  }
  if (!objMontoCantElementos === 0) {
    req.body.objmonto.forEach(elementoObjMonto => {
      if (!elementoObjMonto.monto) {
        postError = postError + " El Json no trae el elemento monto.";
      }
      if (!elementoObjMonto.tipoTransaccion) {
        postError = postError + " El Json no trae el elemento tipoTransaccion.";
      }
    })
  }
  if (!postError == "") {
    console.log(postError);
    res.status(420).json(`Error: ${postError}`);
    return;
  }

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
    estado: 1,
    sender: null,
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
