const m = require("mongoose");
const ObjectId = m.Schema.Types.ObjectId;
/**
 * change date : Date -> Number 
 * change doctor_id: String -> ObjectId
 * delete depart_id
 */

const scheduleSchema = m.Schema({
    // date: Date,
    date: Number, // [0,1,2,3,4,5,6]
    time: String, // [morning, afternoon, evening]
    doctor_id: ObjectId,
    // depart_id: String,
    quota: Number
});

module.exports = m.model("schedule", scheduleSchema);
