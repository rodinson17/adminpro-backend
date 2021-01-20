const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = ( req, res, next ) => {

    // Leer token
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición.'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        //console.log('uid: ', uid);
        req.uid = uid;

        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'El Token no es valido'
        });
    }
};

const validateADMIN_ROLE = async ( req, res, next ) => {
    const uid = req.uid;

    try {

        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        if ( userDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realizar la acción'
            });
        }

        next();
        
    } catch (error) {
        console.log('error validateADMIN_ROLE: ', error);
        return res.status(401).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const validateADMIN_ROLE_o_user = async ( req, res, next ) => {
    const uid = req.uid;
    const id = req.params.id;

    try {

        const userDB = await User.findById( uid );

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            });
        }

        if ( userDB.role === 'ADMIN_ROLE' || uid === id ) {
            next();
        } else {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realizar la acción'
            });
        }

    } catch (error) {
        console.log('error validateADMIN_ROLE: ', error);
        return res.status(401).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

module.exports = {
    validateJWT,
    validateADMIN_ROLE,
    validateADMIN_ROLE_o_user
};