const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subscripcionesSchema = new Schema({
  fechaAlta: Date,
  endpoint: String,
  expirationTime: Date,
  keys: {
    p256dh: String,
    auth: String
  },
  mail: String
},
{ versionKey: false }
)

module.exports = mongoose.model('Suscripciones', subscripcionesSchema)
