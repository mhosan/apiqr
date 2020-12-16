const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estadosSchema = new Schema({
  tipo: Number,
  descripcion: String,
},
  { versionKey: false }
)

module.exports = mongoose.model('estados', estadosSchema);
// 1 = pendiente,
// 2 = aprobado,
// 3 = cancelado,
