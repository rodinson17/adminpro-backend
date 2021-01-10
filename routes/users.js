/*
    Ruta: /api/usuarios
 */
const { Router } = require('express');
const { check } = require('express-validator'); 
const { validateFields } = require('../middlewares/validate-fields');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get( '/', validateJWT, getUsers );

router.post( '/', 
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validateFields
    ], 
    createUser 
);

router.put( '/:id',
    [
        validateJWT,
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        //check('role', 'El role es obligatorio').not().isEmpty(),
        validateFields
    ],    
    updateUser
);

router.delete( '/:id', validateJWT, deleteUser );

module.exports = router;