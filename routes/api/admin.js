const express = require("express"),
    router = express.Router();

const Admin = require("../../models/admin"),
    Doctor = require("../../models/doctor"),
    Schedule = require("../../models/schedule"),
    Department = require('../../models/department');
const consts = require("./consts");

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;

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
    if (req.session.user ?.role != consts.role.admin) {
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

    let doctor_entry = await Doctor.findOne({
        doctor_un: _doctor_id
    })

    // modified
    let depart_entry = await Department.findOne({
        name: _department
    })

    console.log(depart_entry);
    console.log(depart_entry._id);

    await Schedule.findOneAndUpdate({
            depart_id: depart_entry._id
        }, {
            $set: {
                date: _date.getDay(),
                time: _time,
                doctor_id: doctor_entry._id
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
    if (req.session.user ?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /doctor/info_change")
    let _doctor_id = req.body.doctor_id;
    let _department_id = req.body.department;
    let _position = req.body.position;

    let depart_entry = await Department.findOne({
        name: _department_id
    })

    await Doctor.findOneAndUpdate({
            // doctor_id: _doctor_id
            doctor_un: _doctor_id
        }, {
            $set: {
                dept_id: depart_entry._id,
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

async function findSchedules(dept_name, _date, _time, doctor_un) {
    let depart_entry = await Department.findOne({
        name: dept_name
    })
    let doctor_entry = await Doctor.findOne({
        doctor_un : doctor_un
    })

    let all = await Schedule.find({
        date: _date,
        time: _time,
        doctor_id: doctor_entry._id,
        depart_id : depart_entry._id
    });
    let ret = [];
    for (let s of all) {
        let doctor = await Doctor.findById(s.doctor_id);
        let dept = await Department.findById(doctor.dept_id);
        if (dept.name == dept_name) {
            let the_date = new Date();
            let offset = s.date - the_date.getDay();
            the_date.setDate(the_date.getDate() + offset);
            ret.push({
                date: the_date,
                time: s.time,
                doctor_id: s.doctor_id,
                depart_id: dept_name,
                quota: s.quota
            });
        }
    }
    return ret;
}

//post: create schedule
router.post('/schedule/create', async(req, res, next) => {
    if (req.session.user ?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }

    console.log("into /schedule/create");
    let _date = req.body.date;
    let _time = req.body.time;
    let _doctor_id = req.body.doctor_id;
    let _depart_id = req.body.depart_id;
    let _quota = req.body.quota;

    let _day = stringToData(_date);

    var msg = "success"; //return message

    let doctor_entry = await Doctor.findOne({
        doctor_un: _doctor_id
    });
    let depart_entry = await Department.findOne({
        name: _depart_id
    });

    //check if doctor_id already existed.
    let duplicated_data = await findSchedules(_depart_id, _day.getDay(), _time, _doctor_id)
        // await Schedule.find({
        //     date: _date,
        //     time: _time,
        //     doctor_id: ObjectId(_doctor_id),
        //     depart_id: ObjectId(_depart_id)
        // });
    if (duplicated_data.length > 0) {
        msg = "添加排班失败，排班已存在";
    } else {
        await Schedule.create({
            date: _day.getDay(),
            time: _time,
            doctor_id: doctor_entry._id,
            depart_id: depart_entry._id,
            quota: _quota
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

//post: delete schedule
router.post('/schedule/delete', async(req, res, next) => {
    if (req.session.user ?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /schedule/delete");
    let _date = req.body.date; //should be a string like 20220601
    let _section = req.body.section; //should be morning, afternoon or evening
    let _doctor_id = req.body.doctor_id;

    let doctor_entry = await Doctor.findOne({
        doctor_un: _doctor_id
    });
    let depart_entry = await Department.findById(doctor_entry.dept_id);
    
    let _day = stringToData(_date);
    _day = _day.getDay();

    console.log(doctor_entry.doctor_un);
    console.log(depart_entry.name);
    // let deleted_data = await Schedule.find({ //find the data that is to be deleted.
    //     date: _date,
    //     time: _section,
    //     doctor_id: doctor_entry._id
    // });
    let deleted_data = await findSchedules(depart_entry.name, _day, _section, _doctor_id);

    console.log(deleted_data);

    //check if schedule does not exist.
    var msg = "success";

    if (deleted_data.length == 0) {
        msg = "删除排班失败，排班不存在"
    } else {
        await Schedule.deleteOne({
            date: _day,
            time: _section,
            doctor_id: doctor_entry._id,
            depart_id : depart_entry._id
        });
    }

    let r = {
        status: 100,
        msg: msg,
        data: deleted_data
    };

    console.log(r);
    res.json(r);
});

async function getDeptSchedules(dept_name) {
    let all = await Schedule.find({});
    let ret = [];
    for (let s of all) {
        // let dept = await Department.findById(doctor.dept_id);
        let dept = await Department.findById(s.depart_id);
        if (dept.name == dept_name) {
            let the_date = new Date();
            let offset = s.date - the_date.getDay();
            the_date.setDate(the_date.getDate() + offset);
            let doctor = await Doctor.findById(s.doctor_id);
            ret.push({
                date: the_date,
                time: s.time,
                doctor_id: doctor.doctor_un,
                depart_id: dept_name,
                quota: s.quota
            });
        }
    }
    return ret;
}

//get: get schedule according to dept_id(or department)
router.get('/schedule/get', async(req, res, next) => {
    if (req.session.user ?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /schedule/get");
    let dept_name = req.query.dept_id; //should be a department name, like "dentistry".
    console.log(dept_name);

    var msg = "success";
    let data = await getDeptSchedules(dept_name);

    let r = {
        status: 100,
        msg: msg,
        data: data
    };

    console.log(r);
    res.json(r);
});
module.exports = router;