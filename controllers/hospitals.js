const { response } = require('express');
const Hospital = require('../models/hospital');

const getHospitals = async(req, res) => {
    const hospitals = await Hospital.find().populate('user', 'name email img');

    res.json({
        ok: true,
        hospitals
    })
};

const createHospital = async(req, res = response) => {
    const uid = req.uid;
    const hopital = new Hospital({
        user: uid,
        ...req.body
    });

    try {
        // guardar hospital
        const hospitalCreate = await hopital.save();

        res.json({
            ok: true,
            hospital: hospitalCreate
        });        
    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

const updateHospital = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const hospitalDB = await Hospital.findById( id );

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Hospital con ese id'
            });
        }

        // Actualizar hospital
        const changesHospital = {
            ...req.body,
            user: uid
        };
        const hospitalUpdate = await Hospital.findByIdAndUpdate( id, changesHospital, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalUpdate
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

const deleteHospital = async (req, res = response) => {
    const id = req.params.id;

    try {
        const hospitalDB = await Hospital.findById( id );

        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Hospital eliminado.' 
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

module.exports = {
    getHospitals,
    createHospital,
    updateHospital,
    deleteHospital
}