const { Mongoose } = require('mongoose');
const cobrosEsquema = require('../modelos/cobros')
const ctrlPago = {}

//---------------------------------------------------------------------
// get del pago por qr
//---------------------------------------------------------------------
ctrlPago.getPago = (req, res) => {
    const mailRecibido = req.params.mail
    cobrosEsquema.find({ receiver: mailRecibido, estado: 1 }).sort({ fechaOperacionInicio: -1 }).limit(1).exec()
        .then(doc => {
            if (doc[0] === undefined) {
                cobrosEsquema.find({ receiver: mailRecibido }).exec()
                    .then((mailBuscado) => {
                        if (mailBuscado[0] === undefined) {
                            console.log(`Mail recibido: ${mailRecibido}, resultado: No se encuentra ese pago.`);
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
// put del pago por qr
//---------------------------------------------------------------------
ctrlPago.putCobro = (req, res) => {
    // ----------------------------------------------------
    // parametros que recibe en el body:
    // ----------------------------------------------------
    // 1) id 
    // 2) mail sender
    // 3) objmonto
    // 4) estado
    // 5) fecha fin 2020-12-19 00:00:01

    const cantidadDeParametros = Object.keys(req.body).length;
    if (cantidadDeParametros != 5) {                                    //<--- si falta algún param. se terminó
        console.log(`Falta algún parámetro. Deben ser 5.`);
        res.status(400).json(`Falta algún parámetro. Deben ser 5.`);
        return;
    }

    const objetoMontoVacio = false;
    let objMontoRecibido = [];
    let nuevoObjetoMonto = [];
    let postError = "";
    let id = "";
    let sender = "";
    let fechaFinal = new Date();
                                                                        //<--- ver que los param. contengan datos
    if (req.body.id === "") {
        postError = postError + "El id esta vacio."
    } else {
        id = req.body.id;
    }
    if (req.body.sender === "") {
        postError = postError + "Falta el email del sender.";
    } else {
        sender = req.body.sender;
    }
    if (Array.isArray(req.body.objmonto) && req.body.objmonto.length) {
        req.body.objmonto.forEach(elementoObjMonto => {
            if (!elementoObjMonto.monto) {
                postError = postError + " El Json no trae el elemento monto.";
            }
            if (!elementoObjMonto.tipoTransaccion) {
                postError = postError + " El Json no trae el elemento tipoTransaccion.";
            }
        })
    } else {
        objetoMontoVacio = true;
    }
    if (!req.body.estado) {
        postError = postError + "Falta el estado."
    } else {
        const nuevoEstado = req.body.estado;
    }
    if (!req.body.fecha) {
        postError = postError + "Falta la fecha de finalización."
    } else {
        fechaFinal = req.body.fecha
    }
    if (!postError == "") {
        console.log(postError);
        res.status(420).json(`Error: ${postError}`);
        return;
    }

    if (objetoMontoVacio) {
        nuevoObjetoMonto = [];
    } else {
        req.body.objmonto.forEach(element => {
            const objetoMonto = {
                monto: element.monto,
                tipoTransaccion: element.tipoTransaccion
            };
            objMontoRecibido.push(objetoMonto);
        });
        nuevoObjetoMonto = objMontoRecibido;
    }

    const actualizar = { sender: sender, fechaOperacionFinal: fechaFinal, objmonto: nuevoObjetoMonto, estado: 2};

    cobrosEsquema.findByIdAndUpdate(id, actualizar, (err, doc) => {
      if (err) {
        console.log(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
        res.status(404).json(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
      } else {
        console.log(`Actualización Ok del estado del cobro ${JSON.stringify(doc.sender)}`);
        res.status(200).json(`Actualización del estado del cobro ok!`);
      }
    })

}

module.exports = ctrlPago