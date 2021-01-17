const { response } = require('express');
//const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

/* const getUsers = async(req, res) => {
    //const users = await User.find({}, 'name email role google');
    const users = await User.find();

    res.json({
        ok: true,
        users
    })
}; */

const getUsers = async(req, res) => {
    const from = Number( req.query.from ) || 0;
    /* const users = await User.find()
                        .skip( from )
                        .limit( 5 );
    
    const total = await User.count(); */

    // se ejecuntan de manera simultanea mejor rendimiento, se utiliza desustructuracion de arreglos
    const [users, total] = await Promise.all([
        User.find().skip( from ).limit( 5 ),
        User.countDocuments()
    ]);

    res.json({
        ok: true,
        users,
        total
    })
};

const createUser = async(req, res = response) => {
    const { email, password } = req.body;

    /* const errors = validationResult( req );  se pasa a validate-fields.js
    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    } */

    try {
        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya se encuentra registrado.'
            });
        }

        const user = new User( req.body );

        // Encryptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // guardar usuario
        await user.save();

        // Generar token 
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            user: user,
            token
        });        
    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
};

const updateUser = async (req, res = response) => {
    //TODO: validar token y comprobar si es el usuario correcto.
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

        if ( !userDB.google ) fields.email = email;
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

const deleteUser = async (req, res = response) => {
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
    getUsers,
    createUser,
    updateUser,
    deleteUser
}