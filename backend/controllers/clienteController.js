const express = require('express');
const Cliente = require('../models/cliente');

exports.createCliente = async (req, res) => {
    try {
        const { nif, nombre, genero, direccion} = req.body;
        const cliente = new Cliente({ nif, nombre, genero, direccion});
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.nif) {
            return res.status(400).json({ error: 'NIF ya existente' });
        }
        else{
           return res.status(400).json({ error: error.message });
        }
    }
};

exports.getClienteNIF = async (req, res) => {
    try {
        const cliente = await Cliente.findOne({ nif: req.params.nif });
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ createdAt: -1 });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

