const cp = require('../data/codigos_postais.json');
const Conductor = require('../models/Conductor');
const Turno = require('../models/turno');
exports.createConductor = async (req, res) => {
    try {
        const { nif, nombre, genero, anoNacimiento, direccion, licencia } = req.body;
        const conductor = new Conductor({ nif, nombre, genero, anoNacimiento, direccion, licencia });
        await conductor.save();
        res.status(201).json(conductor);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.nif) {
            return res.status(400).json({ error: 'NIF ya existente' });
        }
        else if (error.code === 11000 && error.keyPattern.licencia) {
            return res.status(400).json({ error: 'Licencia ya existente' });
        }
        else{
           return res.status(400).json({ error: error.message });
        }
    }
};


exports.getConductores = async (req, res) => {
    try {
      // ahora pide TODOS los conductores, pero ordenados por updatedAt (el más reciente primero)
      const conductores = await Conductor
        .find()
        .sort({ updatedAt: -1 });
      res.status(200).json(conductores);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

exports.getConductorNIF = async (req, res) => {
    try {
        const conductor = await Conductor.findOne({ nif: req.params.nif });
        if (!conductor) {
            return res.status(404).json({ error: 'Conductor no encontrado' });
        }
        res.status(200).json(conductor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Story 11
//PUT
exports.updateConductor = async (req, res) => {
    try {
    const { nif }     = req.params;
    const updates     = { ...req.body };
    const ahora       = new Date();

    console.log(`→ updateConductor llamado para NIF=${nif}, updates=`, updates);

    // 1) bloquea si conductor tiene un turno activo/futuro
    const turnosActivos = await Turno.find({
        conductor: (await Conductor.findOne({ nif }))._id,
        fin:       { $gte: ahora }
    });
    if (turnosActivos.length > 0) {
        return res
        .status(400)
        .json({ error: 'No se puede modificar, el conductor tiene turnos activos o futuros' });
    }

    // 2) aplicar updates
    const conductor = await Conductor.findOneAndUpdate(
        { nif },
        updates,
        { new: true, runValidators: true }
    );
    if (!conductor) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
    }
    console.log(`→ conductor ${nif} actualizado con éxito`);
    res.json(conductor);

    } catch (err) {
    console.error('ERROR updateConductor:', err);
    res.status(400).json({ error: err.message });
    }
};
  
//DELETE 
exports.deleteConductor = async (req, res) => {
    try {
    const { nif } = req.params;
    const ahora   = new Date();

    console.log(`→ deleteConductor llamado para NIF=${nif}`);

    const conductor = await Conductor.findOne({ nif });
    if (!conductor) {
        return res.status(404).json({ error: 'Conductor no encontrado' });
    }

    // 1) bloquear si tiene turno activo/futuro
    const turnosActivos = await Turno.find({
        conductor: conductor._id,
        fin:       { $gte: ahora }
    });
    if (turnosActivos.length > 0) {
        return res
        .status(400)
        .json({ error: 'No se puede eliminar, el conductor tiene turnos activos o futuros' });
    }

    // 2) eliminar
    await Conductor.deleteOne({ nif });
    console.log(`→ conductor ${nif} eliminado con éxito`);
    res.json({ message: 'Conductor eliminado' });

    } catch (err) {
    console.error('ERROR deleteConductor:', err);
    res.status(400).json({ error: err.message });
    }
};
