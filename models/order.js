const mongoose = require('mongoose');
const { stringify } = require('uuid');

const orderSchema = mongoose.Schema({
    order_id: String,
    user_id: String,
    doctor_id: String,
    date: String,   //20220520
    time: String,   //[morning,afternoon,evening]
    status: String,
    comment: String
});

module.exports = mongoose.model('order', orderSchema);
