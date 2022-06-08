const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const { stringify } = require('uuid');

/**
 * delete order_id
 * change user_id, doctor_id : String -> ObjectId
 * change {date: String, time: String} to time: Date
 * change field : comment(String) -> comments(body: String, date: Date)
 */

const orderSchema = mongoose.Schema({
    user_id: ObjectId,
    doctor_id: ObjectId,
    // date: String,   //20220520
    // time: String,   //[morning,afternoon,evening]
    time: Date,
    status: String,
    comment: { body: String, date: Date } 
});

module.exports = mongoose.model('order', orderSchema);
