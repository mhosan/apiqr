const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  tipo: Number,
  descripcion: String
},
  { versionKey: false }
)

module.exports = mongoose.model('transaccionesTipo', transactionSchema);
// 1 = pesos,
// 2 = peygold,
// 3 = creditos peygold,
// 4 = multipay