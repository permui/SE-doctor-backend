const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    order_id: String,
    user_id: String,
    doctor_id: String,
    time: Date,
    status: String
});

module.exports = mongoose.model('order', orderSchema);