const Taxi = require('../models/taxi');
const Turno = require('../models/turno');
const Viaje = require('../models/Viaje');

exports.createTaxi = async (req, res) => {
    try {
        const { matricula, anoCompra, marca, modelo, nivelConfort } = req.body; 
        const taxi = new Taxi({ matricula, anoCompra, marca, modelo, nivelConfort});
        await taxi.save();
        res.status(201).json(taxi);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Matricula ya existente' });
        }
        else{
            res.status(400).json({ error: error.message });
        }
    }
};

exports.getTaxis = async (req, res) => {
    try {
        const taxis = await Taxi.find().sort({ createdAt: -1 });
        res.json(taxis);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// PUT /taxi/:id
exports.updateTaxi = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };
      const ahora   = new Date();
  
      console.log(`→ updateTaxi llamado para id=${id}, updates=`, updates);
  
      // 1) Comprueba si hay turnos activos/futuros para este taxi
      const turnosActivos = await Turno.find({
        taxi: id,
        fin:  { $gte: ahora }
      });
      if (turnosActivos.length > 0) {
        return res
          .status(400)
          .json({ error: 'No se puede modificar, el taxi está en un turno activo o futuro' });
      }
  
      // 2) Puede actualizar libremente
      const taxi = await Taxi.findByIdAndUpdate(
        id,
        updates,
        { new: true, runValidators: true }
      );
      if (!taxi) {
        return res.status(404).json({ error: 'Taxi no encontrado' });
      }
      console.log(`→ taxi ${id} actualizado con éxito`);
      res.json(taxi);
  
    } catch (err) {
      console.error('ERROR updateTaxi:', err);
      res.status(400).json({ error: err.message });
    }
};

// DELETE /taxi/:id
exports.deleteTaxi = async (req, res) => {
    try {
        const { id } = req.params;
        const ahora   = new Date();

        console.log(`→ deleteTaxi llamado para id=${id}`);

        // 1) Busca turnos activos/futuros
        const turnosActivos = await Turno.find({
        taxi: id,
        fin:  { $gte: ahora }
        });
        if (turnosActivos.length > 0) {
        return res
            .status(400)
            .json({ error: 'No se puede eliminar, el taxi está en un turno activo o futuro' });
        }

        // 2) Borrar si no hay turnos activos
        const deleted = await Taxi.findByIdAndDelete(id);
        if (!deleted) {
        return res.status(404).json({ error: 'Taxi no encontrado' });
        }
        console.log(`→ taxi ${id} eliminado con éxito`);
        res.json({ message: 'Taxi eliminado' });

    } catch (err) {
        console.error('ERROR deleteTaxi:', err);
        res.status(400).json({ error: err.message });
    }
};