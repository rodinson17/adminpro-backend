/*
    Ruta: /api/doctors
 */
const { Router } = require('express');
const { check } = require('express-validator'); 
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getDoctors, createDoctor, updateDoctor, deleteDoctor, getDoctorsById } = require('../controllers/doctors');

const router = Router();

router.get( '/', validateJWT, getDoctors );

router.post( '/', 
    [
        validateJWT,   
        check('name', 'El nombre del Médico es obligatorio.').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido.').isMongoId(),
        validateFields
    ], 
    createDoctor 
);

router.put( '/:id',
    [
        validateJWT,   
        check('name', 'El nombre del Médico es obligatorio.').not().isEmpty(),
        check('hospital', 'El hospital id debe ser valido.').isMongoId(),
        validateFields
    ],    
    updateDoctor
);

router.delete( '/:id', validateJWT, deleteDoctor );

router.get( '/:id', validateJWT, getDoctorsById );

module.exports = router;