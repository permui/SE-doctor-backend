const m = require('mongoose');
const ObjectId = m.Schema.Types.ObjectId;

/**
 * change name doctor_id -> doctor_un
 * change type dept_id: String -> ObjectId
 */

const doctorSchema = m.Schema({
    doctor_un: String,
    name: String,
    gender: String,
    age: Number,
    dept_id: ObjectId,
    position: String,
    password: String,
    intro: String,
    photo: String, // photo link
});

module.exports = m.model('doctor', doctorSchema);