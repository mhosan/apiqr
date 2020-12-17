const qrEsquema = require('../modelos/qr')
const ctrlPagPpal = {}

//---------------------------------------------------------------------
// get 
//---------------------------------------------------------------------
ctrlPagPpal.getCobros = async (req, res) => {
  jsonCobros = [];
  qrEsquema.find().exec()
    .then(cobros => {
      cobros.forEach(element => {
        let fechaMongo = new Date(element.fechaOperacionInicio);
        fechaLocal = fechaMongo.toLocaleString('es-ES');
        const elementoJson = {
          receiver: element.receiver,
          monto: element.monto,
          tipoTransaccion: element.tipoTransaccion,
          estado: element.estado,
          sender: element.sender,
          fecha: fechaLocal
        }
        jsonCobros.push(elementoJson);
      });
      res.render('template', { cobros: jsonCobros })
    })
    .catch(err => {
      console.log(`Error al leer los cobros`);
    });

}

module.exports = ctrlPagPpal
