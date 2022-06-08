const m = require("mongoose");
const ObjectId = m.Schema.Types.ObjectId;

/**
 * YAY: delete diagnosis_id,
 * change patient_id, doctor_id, depart_id to ObjectId
 */

const diagnosisSchema = m.Schema({
    patient_id: ObjectId,
    doctor_id: ObjectId,
    depart_id: ObjectId,
    timestamp: Date,
    diagnosis_message: String,
    medicine_message: String
});

module.exports = m.model("diagnosis", diagnosisSchema);