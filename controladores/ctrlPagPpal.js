const cobrosSchema = require('../modelos/cobros')
const estadosSchema = require('../modelos/estados');
const transactionSchema = require('../modelos/transacType');
const ctrlPagPpal = {}
let arrayEstados = [];
let arrayTransac = [];

const cargaArrayEstados = () => {
  return new Promise((resolve, reject) => {
    estadosSchema.find().exec()
      .then(estadoDB => {
        estadoDB.forEach(element => {
          arrayEstados.push(element)
        });
        resolve(arrayEstados)
      })
      .catch(err => { reject(err) })
  })
}
const cargaArrayTransac = () => {
  return new Promise((resolve, reject) => {
    transactionSchema.find().exec()
      .then(transacDB => {
        transacDB.forEach(element => {
          arrayTransac.push(element)
        });
        resolve(arrayTransac)
      })
      .catch(err => { reject(err) })
  })
}

//---------------------------------------------------------------------
// get 
//---------------------------------------------------------------------
ctrlPagPpal.getCobros = async (req, res) => {
  res.render('template', { mensaje: 'In construction. Sorry for the inconvenience, we are working for you' })
  return;

  jsonCobros = [];
  let i = 0;
  cargaArrayEstados()
    .then(arrayEst => {
      return cargaArrayTransac()
    })
    .then(arrayTransac => {
      cobrosSchema.find({}, null, { sort: { fechaOperacionInicio: -1 } }, (err, doc) => {
        if (err) console.log(err)
        doc.forEach(element => {
          let fechaMongo = new Date(element.fechaOperacionInicio);
          fechaLocal = fechaMongo.toLocaleString('es-ES');
          let estadoDescripcion;
          let transacDescripcion;
          let elementoMonto;
          arrayEstados.forEach(elementEst => {
            if (elementEst.tipo === element.estado) {
              estadoDescripcion = elementEst.descripcion
            }
          });
          if(Array.isArray(element.objmonto) && element.objmonto.length){

            arrayTransac.forEach(elementTran => {   //<------------------------el arrayTransac se lee de la bd, colecc transacciones
              if (elementTran.tipo === element.objmonto[0].tipoTransaccion) {  //<---'element' es la query de la colecc. cobros
                transacDescripcion = elementTran.descripcion
                elementoMonto = element.objmonto[0].monto
              }
            });

          } else {
            transacDescripcion = '-'
            elementoMonto = 0
          }
          const elementoJson = {
            receiver: element.receiver,
            monto: elementoMonto,
            tipoTransaccion: transacDescripcion,
            estado: estadoDescripcion,
            sender: element.sender,
            fecha: fechaLocal
          }
          jsonCobros.push(elementoJson);
          i = i + 1;
          if (i === doc.length) {
            res.render('template', { cobros: jsonCobros })
          }
        })
      })
    })
    .catch(err => { console.log(err) })
}

module.exports = ctrlPagPpal
