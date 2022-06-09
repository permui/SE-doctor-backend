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

function stringToDateBySplit(dateString) {
    if (dateString) {
        let y = dateString.slice(0, 4);
        let m = dateString.slice(4, 6);
        let d = dateString.slice(6, 8);
        return new Date(y, m - 1, d);
    } else {
        console.log("date String null")
    }
}

const express = require('express'),
    router = express.Router();

const Order = require("../../models/order"),
    Doctor = require("../../models/doctor"),
    Patient = require("../../models/patient");
// get
router.get('/get', async (req, res, next) => {
    let { date, doctor_id: doctor_un } = req.query;
    console.log(`/register/get query ${date} ${doctor_un}`);
    
    let doctor_data = await Doctor.findOne({ doctor_un: doctor_un });

    if (!doctor_data) {
        res.json(
            {
                status: 400,
                msg: "fail to find doctor_un",
                data: []
            }
        )
        return;
    }

    let { _id: doctor_id } = doctor_data;
    const day = stringToDateBySplit(date);
    const day_add_1 = day.setDate(day.getDate() + 1);

    let order_data = (await Order.find({
        doctor_id: doctor_id,
        date: {
            $gte: day,
            $lt: day_add_1,
        }
    }).exec()) || [];

    console.log(`/register/get order data ${order_data}`);

    let patient_data = (await Patient.find({
        _id: order_data.map((value)=>value.user_id),
    }).exec()) || [];

    console.log(patient_data);
    var array = [];
    _user_id = order_data.map((value)=>value.user_id);
    _name = patient_data.map((value)=>value.name);
    _time = order_data.map((value) => {
        let time =  new Date(value.time);
        if (time.getHours() < 12) {
            return "morning";
        } else if (time.getHours() < 18) {
            return "afternoon";
        } else {
            return "evening";
        }
    });
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