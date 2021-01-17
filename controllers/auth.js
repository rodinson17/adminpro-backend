const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {
    const { email, password } = req.body;

    try {

        // Verificar email
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Verifique su usuario y contraseña.'
            });
        }

        //  verificar password
        const validpassword = bcrypt.compareSync( password, userDB.password );
        
        if (!validpassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Verifique su usuario y contraseña...'
            });
        }

        // Generar token - JWT
        const token = await generateJWT( userDB.id );

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log('Error... ', error)
        res.status(500).json({
            ok: false,
            msg: 'Error más detalles con el admin.'
        });
    }
};

const googleSingIn = async ( req, res = response ) => {
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify( googleToken );
        let user;

        // Verificar que no exista el usuario
        const userDB = await User.findOne({ email });
        if (userDB) {
            user = userDB;
            user.google = true;
        } else {
            user = new User({
                name,
                email,
                password: '123',
                img: '',
                google: true
            });
        }

        // Guardar en la base de datos
        await user.save();

        // Generar token - JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
        console.log('Error: ', error);
        res.status(401).json({
            ok: false,
            msg: 'Algo salio mal con Google Token'
        });
    }    
}

const refreshToken = async ( req, res = response ) => {
    const uid = req.uid;

    // Generar token - JWT
    const token = await generateJWT( uid );    

    // Obtener usuario 
    const user = await User.findById( uid );

    res.json({
        ok: true,
        user,
        token
    });
};

module.exports = {
    login,
    googleSingIn,
    refreshToken
}