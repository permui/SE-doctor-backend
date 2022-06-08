const m = require("mongoose");

const scheduleSchema = m.Schema({
    date: String,
    time: String, // [morning, afternoon, evening]
    doctor_id: String,
    depart_id: String,
    quota: Number
});

module.exports = m.model("schedule", scheduleSchema);
