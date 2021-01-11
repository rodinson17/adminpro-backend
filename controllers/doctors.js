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
            msg: 'Error inesperado... revisar logs'
        });
    }
};

const updateDoctor = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizar usuario
        const { password, google, email, ...fields} = req.body; // optimizacion de codigo
        /* delete fields.password; // borrar información que no se necesita.
        delete fields.google; */
        /* if (userDB.email === email) { optimización
            delete fields.email;
        } else { */
        if (userDB.email !== email) {
            const existEmail = await User.findOne({ email });

            if (existEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario registrado con ese email.'
                });
            }
        }

        fields.email = email;
        const userUpdate = await User.findByIdAndUpdate( uid, fields, { new: true } );

        res.json({
            ok: true,
            user: userUpdate
        });
    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};

const deleteDoctor = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await User.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usario eliminado.' 
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};

module.exports = {
    getDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor
}