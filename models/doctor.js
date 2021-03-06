const m = require('mongoose');

const doctorSchema = m.Schema({
    doctor_id: String,
    name: String,
    gender: String,
    age: Number,
    dept_id: String,
    position: String,
    password: String,
    intro: String,
    photo: String, // photo link
});

module.exports = m.model('doctor', doctorSchema);