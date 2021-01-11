/* 
    Ruta: /api/all/:search
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const { getSearch, getSearchCollection } = require('../controllers/search');

const router = Router();

router.get( '/:search', validateJWT, getSearch );

router.get( '/collection/:table/:search', validateJWT, getSearchCollection );

module.exports = router;