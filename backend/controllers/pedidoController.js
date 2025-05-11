const Pedido = require('../models/Pedido');


exports.createPedido = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


exports.getPedidosPendientes = async (req, res) => {
  try {
    const confort = req.body.confort;
    const list = await Pedido.find({ estado: 'pendiente', confort })
      .populate('cliente')
    res.json(list);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getPedidoID = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id).populate('cliente');
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.cambiarEstadoPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    pedido.estado = req.body.estado;
    await pedido.save();
    res.status(200).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};