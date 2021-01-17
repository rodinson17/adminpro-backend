const { response } = require('express');
const Doctor = require('../models/doctor');

const getDoctors = async(req, res) => {
    const doctors = await Doctor.find()
                                .populate('user', 'name email img')
                                .populate('hospital', 'name');

    res.json({
        ok: true,
        doctors
    })
};

const createDoctor = async(req, res = response) => {
    const uid = req.uid;
    const doctor = new Doctor({
        user: uid,
        ...req.body
    });

    try {        
        // guardar Medico
        const doctorCreate = await doctor.save();

        res.json({
            ok: true,
            doctor: doctorCreate
        });  

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

const updateDoctor = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const doctorDB = await Doctor.findById( id );

        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Doctor con ese id'
            });
        }

        // Actualizar Doctor
        const changesDoctor = {
            user: uid,
            ...req.body
        };        
        const doctorUpdate = await Doctor.findByIdAndUpdate( id, changesDoctor, { new: true } );

        res.json({
            ok: true,
            doctor: doctorUpdate
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

const deleteDoctor = async (req, res = response) => {
    const id = req.params.id;

    try {
        const doctorDB = await Doctor.findById( id );

        if (!doctorDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un Doctor con ese id'
            });
        }

        await Doctor.findByIdAndDelete( id );

        res.json({
            ok: true,
            msg: 'Doctor eliminado.' 
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el administrador.'
        });
    }
};

const getDoctorsById = async( req, res = response ) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById( id )
                                .populate('user', 'name email img')
                                .populate('hospital', 'name');

        res.json({
            ok: true,
            doctor
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
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorsById
}