const { Mongoose } = require('mongoose');
const cobrosEsquema = require('../modelos/cobros')
const ctrlPago = {}

//---------------------------------------------------------------------
// put del pago por qr
//---------------------------------------------------------------------
ctrlPago.putCobro = (req, res) => {
    // ----------------------------------------------------
    // parametros que recibe en el body:
    // ----------------------------------------------------
    // mail : String,
    // sender : String,
    // objmonto : Array [
    //      {monto: Number, tipoTransaccion: Number}
    //]

    let postError = "";
    const objMontoCantElementos = req.body.objmonto.length;
    if (!req.body.mail) {
        postError = postError + " El Json no trae el elemento mail (del receiver).";
    }
    if (!req.body.sender) {
        postError = postError + " El Json no trae el elemento mail del sender.";
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
    if (!postError == "") {
        console.log(postError);
        res.status(420).json(`Error: ${postError}`);
        return;
    }
    const mail = req.body.mail;
    const sender = req.body.sender;
    const filter = { 'receiver': mail };
    const fechaFinal = new Date();
    let objMontoRecibido = [];
    req.body.objmonto.forEach(element => {
        const objetoMonto = {
            monto: element.monto,
            tipoTransaccion: element.tipoTransaccion
        };
        objMontoRecibido.push(objetoMonto);
    });
    const objmonto = objMontoRecibido

    // cobrosEsquema.findOneAndUpdate(filter, actuEstado, { sort: { fechaOperacionInicio: -1 } }, (err, doc) => {
    //   if (err) {
    //     console.log(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
    //     res.status(404).json(`Error al actualizar el estado del cobro del mail ${mail}. El error es: ${err}`);
    //   } else {
    //     console.log(`Actualización Ok del estado del cobro ${JSON.stringify(doc.sender)}`);
    //     res.status(200).json(`Actualización del estado del cobro ok!`);
    //   }
    // })

    const datosRecibidos = {mail, sender, objmonto}
    res.status(200).json(datosRecibidos);
}

module.exports = ctrlPago