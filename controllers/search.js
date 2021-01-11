const { response } = require('express');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');

const getSearch = async(req, res = response) => {
    const search = req.params.search;
    const regex = new RegExp( search, 'i');

    /* const users = await User.find({ name: regex });
    const hospitals = await Hospital.find({ name: regex });
    const doctors = await Doctor.find({ name: regex }); */

    const [users, hospitals, doctors] = await Promise.all([
        User.find({ name: regex }),
        Hospital.find({ name: regex }),
        Doctor.find({ name: regex })
    ]);

    res.json({
        ok: true,
        users,
        hospitals,
        doctors
    });
};

const getSearchCollection = async(req, res = response) => {
    const collection = req.params.table;
    const search = req.params.search;
    const regex = new RegExp( search, 'i');
    let data = [];

    switch (collection) {
        case 'users':
            data = await User.find({ name: regex });
            break;
        case 'hospitals':
            data = await Hospital.find({ name: regex })
                                .populate('User', 'name');
            break;
        case 'doctors':
            data = await Doctor.find({ name: regex })
                                .populate('User', 'name')
                                .populate('Hospital', 'name');; 
            break;
    
        default:
            return res.status(400).json({
                ok: false,
                msg: 'la tabla debe ser users - hospitals - doctors.'
            });
            break;
    }

    res.json({
        ok: true,
        result: data
    })
};

module.exports = {
    getSearch,
    getSearchCollection
};