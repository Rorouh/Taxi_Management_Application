const Pedido = require('../models/pedido');

// 1) Crear pedido
exports.createPedido = async (req, res) => {
  try {
    const pedido = new Pedido(req.body);
    await pedido.save();
    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// 2) Listar pedidos pendientes (para futuras US)
exports.getPedidosPendientes = async (req, res) => {
  try {
    const list = await Pedido.find({ estado: 'pendiente' })
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