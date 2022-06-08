const mongoose = require('mongoose');

/**
 * delete user_id
 * add hereditary, pastill, height, weight, collect, pic_id
 * I don't know what these fields are for
 */

const patientSchema = mongoose.Schema({
    gender: String,
    name: String,
    email: String,
    phone: String,
    password: String,
    age: Number,
    hereditary: String,
    pastill: String,
    height: String,
    weight: String,
    collect: [],
    pic_id: String,
});

module.exports = mongoose.model('patient', patientSchema);