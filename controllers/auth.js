const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

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

        // Generar token 
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

module.exports = {
    login
}