// function formatDate(date, format) {
//     const map = {
//         mm: date.getMonth() + 1,
//         dd: date.getDate(),
//         yyyy: date.getFullYear()
//     }

//     return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
// }


// const randomAddTime = () => {
//     let now = new Date();
//     var now_s = now.getTime();
//     let then = now;
//     const rdHourNum = Math.ceil(Math.random()); //0 or 1
//     const rdMintueNum = Math.ceil(Math.random() * 60); // 1-60
//     then.setTime(now_s + 1000 * 60 * (rdMintueNum) + 1000 * 60 * 60 * rdHourNum);
//     return then;
// };

function stringToDataBySplit(dateString) {
    if (dateString) {
        let timearray = dateString.split('-');
        var year = timearray[0];
        var month = timearray[1];
        var date = timearray[2];
        var time_date = new Date(year, month - 1, date);
        return time_date;
    } else {
        console.log("data String null")
    }
}

const express = require('express'),
    router = express.Router();

const Order = require("../../models/order"),
    Patient = require("../../models/patient");
// get
router.get('/get', async(req, res, next) => {
    let _date = req.query.date;
    let _doctor_id = req.query.doctor_id;
    _date = stringToDataBySplit(_date);

    let order_data = (await Order.find({
        doctor_id: _doctor_id,
        date: _date
    }).exec()) || [];

    let patient_data = (await Patient.find({
        user_id: order_data.user_id,
    }).exec()) || [];

    var array = new Array();
    array[0] = order_data.user_id;
    array[1] = patient_data.name;
    array[2] = order_data.time;
    let r = {
        status: 100,
        msg: "success",
        data: array
    }

    console.log(r);
    res.json(r);
});

module.exports = router;