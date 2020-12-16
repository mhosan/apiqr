// const qrEsquema = require('../modelos/qr')
const ctrlPagPpal = {}

// get subscripciones
ctrlPagPpal.getSubscripciones = async (req, res) => {
  res.render('template', { saludo: 'hola reputo mundo' })
}

module.exports = ctrlPagPpal
