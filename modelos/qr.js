const mongoose = require('mongoose')
const Schema = mongoose.Schema

const qrSchema = new Schema({
  mailReceiver: String,
  montoPesos: Number,
  montoPeygold: Number,
  montoCreditosPeygold: Number,
  montoMultiplay: Number,
  estado: Number,
  fechaHora: Date
},
  { versionKey: false }
)

module.exports = mongoose.model('cobros', qrSchema)
