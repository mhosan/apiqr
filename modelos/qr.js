const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrSchema = new Schema({
  receiver: String,
  objmonto: [{
    monto: Number,
    tipoTransaccion: Number
  }],
  estado: Number,
  fechaOperacionInicio: Date,
  fechaOperacionFinal: Date,
  sender: String
},
  { versionKey: false }
)
module.exports = mongoose.model('cobros', qrSchema);
// tipo transacc:
// 1 = pesos,
// 2 = peygold,
// 3 = creditos peygold,
// 4 = multipay
// ----------------------------------
// estado:
// 1 = pendiente,
// 2 = aprobado,
// 3 = cancelado,
// -----------------------------------
// {"mail":"cristianlp.torr@gmail.com",   
// "monto": 3250.34,
// "tipoTransaccion": 1,
// "estado": 1,
// "sender": "pepegrillo@gmail.com"
// }