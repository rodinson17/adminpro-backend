/* 
    Ruta: /api/upload/
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');
const expressFileUpload = require('express-fileupload');
const { uploadFile, readFile } = require('../controllers/uploads');

const router = Router();

router.use( expressFileUpload() );

router.put( '/:type/:id', validateJWT, uploadFile );

router.get( '/:type/:img', readFile );

module.exports = router;