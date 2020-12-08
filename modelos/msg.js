const mongoose = require('mongoose')
const Schema = mongoose.Schema

const msgSchema = new Schema({
  title: String,
  bodyMessage: String,
  iconImage: String,
  date: Date,
  category: Number,
  status: Number,
  auth: String,
  mail: String
},
{ versionKey: false }
)

module.exports = mongoose.model('MensajesNada', msgSchema)
