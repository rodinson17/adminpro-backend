const mongoose = require('mongoose');

const conectionDB = async () => {
    try { 
        /* await mongoose.connect('mongodb://localhost/test', { 
            user: rodinson
            password: 2NzV3ucNXPWryE6E
        */
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online...');
    } catch (error) {
        console.log('Error: ', error);
        throw new Error('Error al iniciar la DB');
    }
}

module.exports = {
    conectionDB
}