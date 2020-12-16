const qrEsquema = require('../modelos/qr')
const ctrlCobro = {}

// post
ctrlCobro.postCobro = async (req, res) => {
  res.status(200).json('todo bien');
  const nuevoCobro = new qrEsquema ({
    mailReceiver: "vaLaPepa@gmail.com",
    montoPesos: 10.0,
    montoPeygold: 0.0,
    montoCreditosPeygold: 0.0,
    montoMultiplay: 0.0,
    estado: 1,
    fechaHora: Date()
  });
  nuevoCobro.save();
}

module.exports = ctrlCobro
