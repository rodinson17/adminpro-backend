
const fs = require('fs');

const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const deleteOldFile = ( pathOld ) => {
    if (fs.existsSync( pathOld )) {
        // Borrar la imagen anterior
        fs.unlinkSync( pathOld );
    }
}

const updateImage = async (type, id, nameFile) => {
    let pathOld = '';

    switch (type) {
        case 'users':
            const user = await User.findById(id);        
            if (!user) return false;
            
            pathOld = `./uploads/users/${ user.img }`;
            deleteOldFile( pathOld );

            user.img = nameFile;
            await user.save();
            return true;
            
            break;
        case 'hospitals':
            const hospital = await Hospital.findById(id);        
            if (!hospital) return false;
            
            pathOld = `./uploads/hospitals/${ hospital.img }`;
            deleteOldFile( pathOld );

            hospital.img = nameFile;
            await hospital.save();
            return true;
            
            break;
        case 'doctors':
            const doctor = await Doctor.findById(id);        
            if (!doctor) return false;
            
            pathOld = `./uploads/doctors/${ doctor.img }`;
            deleteOldFile( pathOld );

            doctor.img = nameFile;
            await doctor.save();
            return true;

            break;
    
        default:
            break;
    }
};

module.exports = {
    updateImage
}
