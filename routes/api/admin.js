const express = require("express"),
    router = express.Router();

const Admin = require("../../models/admin"),
    Doctor = require("../../models/doctor"),
    Schedule = require("../../models/schedule");
const consts = require("./consts");

function stringToData(dateString) {
    if (dateString) {
        var year = dateString.slice(0, 4);
        var month = dateString.slice(4, 6);
        var date = dateString.slice(6, 8);
        var time_date = new Date(year, month - 1, date);
        return time_date;
    } else {
        console.log("data String null")
    }
}

// // not completed
router.post('/schedule/upload', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /schedule/upload")
    let _schedule_id = req.body.schedule_id;
    let _department = req.body.department;
    let _time = req.body.time;
    let _doctor_id = req.body.doctor_id;

    // time transfer

    let _date = stringToData(_schedule_id)

    // modified

    await Schedule.findOneAndUpdate({
        depart_id: _department
    }, {
        $set: {
            date: _date,
            time: _time,
            doctor_id: _doctor_id
        }
    }
    // , {}, function(err, data) { //debug function
    //     if (err) {
    //         console.log('Error in database')
    //     } else if (!data) {
    //         console.log('Not such data')
    //         console.log(data)
    //     } else {
    //         console.log('Modify schedule data success')
    //         console.log(data)
    //     }
    // }
    );

    let r = {
        status: 100,
        msg: "success",
        data: {}
    };

    console.log(r);
    res.json(r);
});

// post: info_change
router.post('/doctor/info_change', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /doctor/info_change")
    let _doctor_id = req.body.doctor_id;
    let _department = req.body.department;
    let _position = req.body.position;

    await Doctor.findOneAndUpdate({
        doctor_id: _doctor_id
    }, {
        $set: {
            dept_id: _department,
            position: _position
        }
    }
    // , {}, function(err, data) { //debug function
    //     if (err) {
    //         console.log('Error in database')
    //     } else if (!data) {
    //         console.log('Not such data')
    //         console.log(data)
    //     } else {
    //         console.log('Modify doctor data success')
    //         console.log(data)
    //     }
    // }
    );

    let r = {
        status: 100,
        msg: "success",
        data: {}
    };

    console.log(r);
    res.json(r);
})

//post: create doctor
router.post('/doctor/create', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /doctor/create")
    let _doctor_id = req.body.doctor_id;
    let _name = req.body.name;
    let _gender = req.body.gender;
    let _age = req.body.age;
    let _dept_id = req.body.dept_id;
    let _position = req.body.position;
    let _password = req.body.password;
    let _intro = req.body.intro;
    let _photo = req.body.photo;
    
    var msg = "success";//return message

    //check if doctor_id already existed.
    let duplicated_data = await Doctor.find({
        doctor_id: _doctor_id
    });
    if(duplicated_data.length>0){
        msg = "create doctor failed. doctor_id already existed.";
    }else{
        await Doctor.create({
            doctor_id: _doctor_id,
            name: _name,
            gender: _gender,
            age: _age,
            dept_id: _dept_id,
            position: _position,
            password: _password,
            intro: _intro,
            photo: _photo,
        });
    }

    let r = {
        status: 100,
        msg: msg,
        data: {}
    };

    console.log(r);
    res.json(r);
});

//post: delete doctor
router.post('/doctor/delete', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /doctor/delete");
    let _doctor_id = req.body.doctor_id;
    console.log(_doctor_id);

    let deleted_data = await Doctor.find({//find the data that is to be deleted.
        doctor_id: _doctor_id
    });

    console.log(deleted_data);

    //check if doctor_id does not exist.
    var msg = "success";
    if(deleted_data.length==0){
        msg = "deletion failed. doctor_id does not exist."
    }else{
        await Doctor.remove({
            doctor_id: _doctor_id
        });
    }

    let r = {
        status: 100,
        msg: msg,
        data: deleted_data
    };

    console.log(r);
    res.json(r);
})
module.exports = router;