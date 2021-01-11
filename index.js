
const express = require('express');

require('dotenv').config();
const cors = require('cors')

const { conectionDB } = require('./database/config');

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use( cors() )

// Lectura y parseo del body
app.use( express.json() );

// Coneción Db
conectionDB();

// Rutas 
app.use( '/api/users', require('./routes/users') );
app.use( '/api/hospitals', require('./routes/hospitals') );
app.use( '/api/doctors', require('./routes/doctors') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/all', require('./routes/search') );
app.use( '/api/upload', require('./routes/uploads') );

app.listen( process.env.PORT, () => {
    console.log('Servidor corriendo en puerto: ' + 3000 );
});