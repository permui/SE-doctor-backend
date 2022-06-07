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

//post: create schedule
router.post('/schedule/create', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
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
    
    var msg = "success";//return message

    //check if doctor_id already existed.
    let duplicated_data = await Schedule.find({
        date: _date,
        time: _time,
        doctor_id: _doctor_id,
        depart_id: _depart_id
    });
    if(duplicated_data.length>0){
        msg = "添加排班失败，排班已存在";
    }else{
        await Schedule.create({
            date: _date,
            time: _time,
            doctor_id: _doctor_id,
            depart_id: _depart_id,
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
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /schedule/delete");
    let _date = req.body.date;  //should be a string like 20220601
    let _section = req.body.section;    //should be morning, afternoon or evening
    let _doctor_id = req.body.doctor_id;

    let deleted_data = await Schedule.find({//find the data that is to be deleted.
        date : _date,
        time : _section,
        doctor_id : _doctor_id
    });

    console.log(deleted_data);

    //check if schedule does not exist.
    var msg = "success";
    if(deleted_data.length==0){
        msg = "删除排班失败，排班不存在"
    }else{
        await Schedule.remove({
            date : _date,
            time : _section,
            doctor_id : _doctor_id
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

const scheduleinfoToInterface = (doc) => {
    if (doc !== null && doc !== undefined) {
        return {
            date: doc.date,
            section: doc.time,
            doctor_id: doc.doctor_id,
            position: doc.position,
            moreUrl: "/api/user/" + doc.doctor_id + "/info"
        };
    }
    return doc;
};

//get: get schedule according to dept_id(or department)
router.get('/schedule/get', async(req, res, next) => {
    if (req.session.user?.role != consts.role.admin) {
        let r = { status: 205, msg: "requester not an admin", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /schedule/get");

    let _dept_id = req.query.dept_id; //should be a department name, like "dentistry".
    // let _date = req.query.date;
    // let _section = req.query.time;
    // let _doctor = req.query.doctor_id;

    var msg = "success";
    // let data = Schedule; // ???

    let data = await Schedule.find({
        depart_id : _dept_id
    });

    let r = {
        status: 100,
        msg: msg,
        data: data
    };

    console.log(r);
    res.json(r);
});
module.exports = router;