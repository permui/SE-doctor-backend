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
        // let timearray = dateString.split('-');
        let timearray = dateString.replace(/-/g,'/');
        // var year = timearray[0];
        // var month = timearray[1];
        // var date = timearray[2];
        // console.log(year);
        // console.log(month);
        // console.log(date);
        // var time_date = new Date(year, month - 1, date+1);
        console.log(timearray);
        var time_date = new Date(timearray);
        console.log(time_date);
        var time_date_ISO = time_date.toISOString();
        console.log(time_date_ISO);
        return time_date_ISO;
    } else {
        console.log("data String null")
    }
}

const express = require('express'),
    router = express.Router();

const order = require('../../models/order');
const Order = require("../../models/order"),
    Patient = require("../../models/patient");
// get
router.get('/get', async (req, res, next) => {
    let { date, doctor_id: doctor_un } = req.query;
    console.log(`/register/get query ${req.query}`);
    
    let { _id: doctor_id} = await Doctor.findOne({ doctor_un: doctor_un });

    let order_data = (await Order.find({
        doctor_id: doctor_id,
        date: date
    }).exec()) || [];

    console.log(`/register/get order data ${order_data}`);

    let patient_data = (await Patient.find({
        _id: order_data.map((value)=>value.user_id),
    }).exec()) || [];

    console.log(patient_data);
    var array = [];
    _user_id = order_data.map((value)=>value.user_id);
    _name = patient_data.map((value)=>value.name);
    _time = order_data.map((value)=>value.time);
    console.log(_user_id);
    console.log(_name);
    console.log(_time);

    for(var i=0; i<_user_id.length; i++){
        array.push({user_id:_user_id[i],
                    name:_name[i],
                    time:_time[i]});
    }
    let r = {
        status: 100,
        msg: "success",
        data: array
    }

    console.log(r);
    res.json(r);
});

module.exports = router;