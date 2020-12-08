const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  catIndex: Number,
  catLabel: String,
  catDescrip: String
},
{ versionKey: false }
)

module.exports = mongoose.model('categorias', categorySchema)
