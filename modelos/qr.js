const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const qrSchema = new Schema({
  receiver: String,
  monto: Number,
  tipoTransaccion: Number,
  estado: Number,
  fechaOperacion: Date,
  sender: String
},
  { versionKey: false }
)

module.exports = mongoose.model('cobros', qrSchema);
