const cobrosSchema = require('../modelos/qr')
const estadosSchema = require('../modelos/estados');
const transactionSchema = require('../modelos/transacType');
const ctrlPagPpal = {}

//---------------------------------------------------------------------
// get 
//---------------------------------------------------------------------
ctrlPagPpal.getCobros = async (req, res) => {
  jsonCobros = [];

  cobrosSchema.find().exec()
    .then(doc => {
      let i = 0;
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
      console.log(`Error: ${err}`);
    })


  // qrEstados.find().exec()
  //   .then(doc => {
  //     console.log(doc);
  //     //console.log(doc[0].tipo);
  //     qrEsquema.find().exec()
  //       .then(cobros => {
  //         cobros.forEach(element => {
  //           let fechaMongo = new Date(element.fechaOperacionInicio);
  //           fechaLocal = fechaMongo.toLocaleString('es-ES');
  //           //setear estado
  //           doc.forEach(element => {
  //             // if (element.tipo === 1){
  //             //   console.log(`lo encontré: ${element.tipo}`)
  //             // }
  //             console.log(element)
  //           });
  //           const elementoJson = {
  //             receiver: element.receiver,
  //             monto: element.monto,
  //             tipoTransaccion: element.tipoTransaccion,
  //             estado: element.estado,
  //             sender: element.sender,
  //             fecha: fechaLocal
  //           }
  //           jsonCobros.push(elementoJson);
  //         });
  //         res.render('template', { cobros: jsonCobros })
  //       })
  //       .catch(err => {
  //         console.log(`Error al leer los cobros`);
  //       });
  //   })
  //   .catch(err => {
  //     console.log(`Error ${err}`)

  //   })
}
const enviarResultados = (res, resultados) => {
  res.render('template', { cobros: resultados });
}

module.exports = ctrlPagPpal
