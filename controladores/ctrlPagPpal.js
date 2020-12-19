const cobrosSchema = require('../modelos/qr')
const estadosSchema = require('../modelos/estados');
const transactionSchema = require('../modelos/transacType');
const ctrlPagPpal = {}

//---------------------------------------------------------------------
// get 
//---------------------------------------------------------------------
ctrlPagPpal.getCobros = async (req, res) => {
  jsonCobros = [];
  let i = 0;
  cobrosSchema.find().sort({monto:1}).exec()  //
    .then(doc => {
      doc.forEach(element => {
        let fechaMongo = new Date(element.fechaOperacionInicio);
        fechaLocal = fechaMongo.toLocaleString('es-ES');
        estadosSchema.find({ 'tipo': element.estado }).exec()
          .then(estadoDB => {
            const estadoDescripcion = estadoDB[0].descripcion;
            transactionSchema.find({ 'tipo': element.tipoTransaccion }).exec()
              .then(transacDB => {
                const transacDescripcion = transacDB[0].descripcion;
                const elementoJson = {
                  receiver: element.receiver,
                  monto: element.monto,
                  tipoTransaccion: transacDescripcion,
                  estado: estadoDescripcion,
                  sender: element.sender,
                  fecha: fechaLocal
                }
                jsonCobros.push(elementoJson);
                i = i + 1;
                //ver si es la ultima vuelta
                if (i === doc.length) {
                  console.log(jsonCobros)
                  res.render('template', { cobros: jsonCobros })
                }
              })
              .catch(err => {
                console.log(`Error al buscar el tipo de transaccion: ${err}`)
              })
          })
          .catch(err => {
            console.log(`Error al buscar el estado: ${err}`)
          })
      })  //<---foreach
    })  //<---then ppal.
    .catch(err => {
      console.log(`Error en la query sobre la tabla cobros: ${err}`);
    })
}

module.exports = ctrlPagPpal
