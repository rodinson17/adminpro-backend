const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');

const uploadFile = async(req, res = response) => {
    const type = req.params.type;
    const id = req.params.id;

    // Validar tipo
    const typesValid = ['users', 'hospitals', 'doctors'];
    if (!typesValid.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: 'El tipo debe ser users, hospitals o doctors'
        });
    }

    // validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    // Procesar la imagen...
    const file =  req.files.image;
    const nameCut = file.name.split('.'); // namefile.1.2.jpg
    const extensionFile = nameCut[ nameCut.length - 1 ];

    // validar extension
    const extensionValid = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionValid.includes( extensionFile )){
        return res.status(400).json({
            ok: false,
            msg: 'La extensión del archivo no es permitida.'
        });
    }

    // Generar nombre del archivo
    const nameFile = `${ uuidv4() }.${ extensionFile }`;

    // Path para guardar la imagen
    const path = `./uploads/${ type }/${ nameFile }`;

    // Mover la imagen
    file.mv( path, (err) => {
        if (err) {
            console.log('Error: ', err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar imagen DB
        updateImage( type, id, nameFile );

        res.json({
            ok: true,
            msg: 'Archivo subido',
            nameFile
        });
    });
};

const readFile = async(req, res = response) => {
    const type = req.params.type;
    const img = req.params.img;

    const pathImg = path.join( __dirname, `../uploads/${ type }/${ img }` );

    // Imagen por defecto
    if (fs.existsSync( pathImg )) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, '../uploads/no-image-found.png' );
        res.sendFile( pathImg );
    }
};

module.exports = {
    uploadFile,
    readFile
};