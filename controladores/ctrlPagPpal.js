// const qrEsquema = require('../modelos/qr')
const ctrlPagPpal = {}

// get 
ctrlPagPpal.get = async (req, res) => {
  res.render('template', { saludo: 'hola reputo mundo' })
}

module.exports = ctrlPagPpal
