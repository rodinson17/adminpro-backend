/*
    Ruta: /api/auth
 */
const { Router } = require('express');
const { check } = require('express-validator'); 
const { validateFields } = require('../middlewares/validate-fields');
const { login, googleSingIn } = require('../controllers/auth');

const router = Router();

router.post( '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validateFields
    ],
    login
);

router.post( '/google', 
    [
        check('token', 'El token de Google es obligatoria').not().isEmpty(),
        validateFields
    ],
    googleSingIn
);

module.exports = router;