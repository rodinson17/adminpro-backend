
const express = require('express');

require('dotenv').config();
const cors = require('cors')

const { conectionDB } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() )

// Coneción Db
conectionDB();

// Rutas 
app.get( '/', (rep, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    })
});

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + 3000 );
});