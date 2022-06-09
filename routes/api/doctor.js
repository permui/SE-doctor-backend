const express = require('express'),
    router = express.Router();

const Doctor = require('../../models/doctor'),
    Schedule = require('../../models/schedule'),
    Order = require('../../models/order'),
    Patient = require('../../models/patient'),
    Diagnosis = require('../../models/diagnosis'),
    Department = require('../../models/department');
const { v4: uuidv4 } = require('uuid');
const consts = require("./consts");

const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId;



const doctorDocToInterface = (doc) => {
    if (doc !== null && doc !== undefined) {
        let depart_entry = Department.findById(doc.dept_id)

        return {
            doctor_id: doc.doctor_un,
            name: doc.name,
            gender: doc.gender,
            age: doc.age,
            dept_id: depart_entry.name,
            position: doc.position,
            password: doc.password,
            intro: doc.intro,
            photo: doc.photo,
        };
    }
    return doc;
};


// YAY: test ok
router.get('/details', async(req, res, next) => {
    let id = req.query.doctor_id;
    console.log(id)
        // let data = await Doctor.findOne({ doctor_id: id });
    let data = await Doctor.findOne({ doctor_un: id });
    const result = doctorDocToInterface(data);

    let r = {
        status: 100,
        msg: "success",
        data: result
    };
    console.log(r);
    res.json(r);
});


const scheduleDocToInterface = async (doc) => {
    if (doc !== null && doc !== undefined) {
        let the_date = new Date();
        let offset = doc.date - the_date.getDay();
        the_date.setDate(the_date.getDate() + offset);

        let doctor_entry = await Doctor.findById(doc.doctor_id);
        let dept_entry = await Department.findById(doctor_entry.dept_id); // may need change
        return {
            date: the_date,
            time: doc.time,
            doctor_id: doctor_entry.doctor_un,
            depart_id: dept_entry.name,
            quota: doc.quota
        };
    }
    return doc;
};

// YAY: test ok
router.get("/schedule", async(req, res, next) => {
    let id = req.query.doctor_id;
    let doctor_entry = await Doctor.findOne({
        doctor_un: id
    });
    let data = await Schedule.find({ doctor_id: doctor_entry._id });
    const result = await Promise.all(data.map(scheduleDocToInterface));

    let r = {
        status: 200,
        msg: "success",
        data: result
    };
    console.log(r);
    res.json(r);
});


//Yiping Wang


// wyp add the following function
// not completed, if paging is needed

const doctorinfoToInterface = async (doc) => {
    if (doc !== null && doc !== undefined) {
        let depart_entry = await Department.findById(doc.dept_id);

        return {
            doctor_id: doc.doctor_un,
            doctor_name: doc.name,
            dept_id: depart_entry.name,
            position: doc.position,
            moreUrl: "/api/user/" + doc.doctor_un + "/info"
        };
    }
    return doc;
};

// YAY: test ok
// get list of information
router.get('/get', async(req, res, next) => {
    console.log("into info/get");
    let _name = req.query.name;
    let _department = req.query.department;
    let _page_size = req.query.pageSize;
    let _page_num = req.query.current; // start from 1

    // _name = _name ? _name : { $regex: ".*" }
    // _department = _department ? _department : { $regex: ".*" }

    // search
    // console.log(_name, _department)
    console.log("name: ", _name)
    console.log("department: ", _department)

    let result = await Doctor.aggregate([
        {
            $lookup: {
                from: "departments",
                localField: "dept_id",
                foreignField: "_id",
                as: "dept_name"
            }
        },
    ]);

    let new_res = [];
    for (let d of result) {
        if (_name && d.name != _name) continue;
        if (_department && d.dept_name[0].name != _department) continue;
        new_res.push(d);
    }

    result = await Promise.all(new_res.map(doctorinfoToInterface));

        // console.log(_name)

    // let dept_id = await Department.findOne({ name: _department });
    // let depart_entry = await Department.findOne({ name: _department });
    // // YAY: here

    // _data = (await Doctor.find({
    //         name: _name,
    //         dept_id: depart_entry._id,
    //     }).sort({ doctor_id: 1 })
    //     .skip((_page_num - 1) * _page_size)
    //     .limit(_page_size) //page
    //     .exec()) || [];


    // console.log(_data)
    // let result = _data.map(doctorinfoToInterface);

    

    // return
    let r = {
        status: 100,
        msg: "success",
        data: {
            return_count: result.length,
            doctor_list: result
                // [{
                //     //not sure if this way works
                //     doctor_id: _data.doctor_id,
                //     doctor_name: _data.name,
                //     department: _data.dept_id,
                //     position: _data.position,
                //     moreUrl: "/api/user/" + _data.doctor_id + "/info"
                // }]
        }
    };

    console.log(r);
    res.json(r);
});

// YAY: test ok
//post: delete doctor
router.delete('/delete', async(req, res, next) => {
    if (req.session.user ?.role != consts.role.admin) {
        let r = { status: 205, msg: "只有管理员才能删除！", data: {} };
        console.log(r);
        res.json(r);
        return;
    }
    console.log("into /doctor/delete");
    let _doctor_id = req.body.doctor_id;
    console.log(_doctor_id);

    let deleted_data = await Doctor.find({ //find the data that is to be deleted.
        doctor_un: _doctor_id
    });

    console.log(deleted_data);

    //check if doctor_id does not exist.
    var msg = "success";
    if (deleted_data.length == 0) {
        msg = "deletion failed. doctor_id does not exist."
    } else {
        await Doctor.remove({
            doctor_un: _doctor_id
        });
    }

    let result = deleted_data.map(doctorDocToInterface);

    let r = {
        status: 100,
        msg: msg,
        data: result
    };

    console.log(r);
    res.json(r);
})


// YAY: test ok
//post: create doctor
router.post('/create', async(req, res, next) => {
    if (req.session.user ?.role != consts.role.admin) {
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

    var msg = "success"; //return message

    let duplicated_data = await Doctor.findOne({
        doctor_un: _doctor_id
    })


    //check if doctor_id already existed.
    // let duplicated_data = await Doctor.find({
    //     doctor_id: _doctor_id
    // });
    if (duplicated_data) {
        msg = "create doctor failed. doctor_id already existed.";
    } else {
        let depart_entry = await Department.findOne({ name: _dept_id });
        if (!depart_entry) {
            msg = "department not found.";
        } else {
            await Doctor.create({
                doctor_un: _doctor_id,
                name: _name,
                gender: _gender,
                age: _age,
                dept_id: depart_entry._id,
                position: _position,
                password: _password,
                intro: _intro,
                photo: _photo,
            });
        }
    }

    let r = {
        status: 100,
        msg: msg,
        data: {}
    };

    console.log(r);
    res.json(r);
});

// post: modify
router.post('/info/modify', async(req, res, next) => {
    let _doctor_id = req.body.doctor_id;
    let _doctor_name = req.body.doctor_name;
    let _gender = req.body.gender;
    let _age = req.body.age;
    let _department = req.body.department;
    let _photo = req.body.photo;
    let _position = req.body.position;

    // modified

    let depart_entry = await Department.findOne({ name: _department });

    await Doctor.findOneAndUpdate({
            doctor_un: _doctor_id
        }, {
            $set: {
                name: _doctor_name,
                gender: _gender,
                age: _age,
                dept_id: depart_entry._id, // should not be uuidv4 here?
                photo: _photo,
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
        //         console.log('Modify data success')
        //         console.log(data)
        //     }
        // }
    );

    // return
    let r = {
        status: 100,
        msg: "Permission denied",
    };

    console.log(r);
    res.json(r);
});

// post: call
router.post('/call', async(req, res, next) => {
    let { user_id: name } = req.body;

    console.log(name);

    // yangrq modified here
    let patient = await Patient.findOne({ name: name }).exec();
    let patient_id = patient._id;

    deletedOrder = await Order.findOne({ user_id: patient_id });
    console.log(deletedOrder);

    await Order.findOneAndRemove({
            user_id: patient_id // some problem here ---> one patient <-> one order_id 
        }
        // , {}, function(err, data) { //debug function
        //     if (err) {
        //         console.log('Error in database')
        //     } else if (!data) {
        //         console.log('Not such data')
        //         console.log(data)
        //     } else {
        //         console.log('Remove data success')
        //         console.log(data)
        //     }
        // }
    );

    // return
    let r = {
        status: 100,
        msg: "Permission denied",
    };

    console.log(r);
    res.json(r);
});


function formatDate(date, format) {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yyyy: date.getFullYear()
    }

    return format.replace(/mm|dd|yyyy/gi, matched => map[matched])
};



const patientDocToInterface = (doc) => {

};

// get: patient_info
// TODO: YANGRQ modified here
router.get('/patient_info/get', async(req, res, next) => {
    let { user_id: user_name } = req.query;

    let patient_data = await Patient.findOne({
        name: user_name
    }).exec();

    let patient_obj_id = patient_data._id;
    console.log(`patient obj id is ${patient_obj_id}`)

    let order_data = await Order.findOne({
        user_id: patient_obj_id
    }).exec();

    let { doctor_id } = order_data;
    console.log(`doctor obj id is ${doctor_id}`)

    let doctor_data = await Doctor.findOne({
        _id: doctor_id
    }).exec();

    console.log(`doctor data is ${doctor_data}`);

    let { dept_id } = doctor_data;
    // let department_data = await Department.findOne({ _id: dept_id });
    let department_data = await Department.findById(dept_id).exec();

    console.log(`depart data is ${department_data}`);

    let r = {
        id: patient_obj_id,
        name: user_name,
        gender: patient_data.gender,
        age: patient_data.age,
        phone: patient_data.phone,
        appoint_date: order_data.date,
        section: order_data.time, //SectionType.Afternoon, // need export, not completed []
        department: department_data.name,
        history: [] //_data.history
    };

    console.log(`/patient_info/get return ${r}`);
    res.json(r);
});


// const diagnosisInterfaceToDoc = (interface) => {
//     const now = new Date();
//     // let _timestamp = formatDate(now, 'yyyy-mm-dd');

//     if (interface !== null && interface !== undefined &&
//         interface.diagnosis_id !== null && interface.diagnosis_id !== undefined) {
//         return {
//             // diagnosis_id: //uuidv4(),
//             patient_id: ObjectId(interface.patient_id),
//             doctor_id: ObjectId(interface.doctor_id),
//             depart_id: ObjectId(interface.department),
//             timestamp: now, //_timestamp,
//             diagnosis_message: interface.diagnosis_message,
//             medicine_message: interface.medicine_message
//         }
//     }
//     return undefined;
// };

// TODO: YANGRQ modified here
const diagnosisInterfaceToDoc = async (interface) => {
    const now = new Date();
    // let _timestamp = formatDate(now, 'yyyy-mm-dd');

    const patient_data = await Patient.findOne({ name: interface.patient_id });
    const doctor_data = await Doctor.findOne({ doctor_un: interface.doctor_id });
    const depart_data = await Department.findOne({ name: interface.department });

    const { _id: patient_id } = patient_data;
    const { _id: doctor_id } = doctor_data;
    const { _id: depart_id } = depart_data;

    if (interface !== null && interface !== undefined &&
        interface.diagnosis_id !== null && interface.diagnosis_id !== undefined) {
        return {
            // diagnosis_id: uuidv4(),
            patient_id,
            doctor_id,
            depart_id,
            timestamp: now, //_timestamp,
            diagnosis_message: interface.diagnosis_message,
            medicine_message: interface.medicine_message
        }
    }
    return undefined;
};

// get: patient_info
router.post('/diagnostic_msg/upload', async(req, res, next) => {
    console.log("into /diagnostic_msg/upload");

    let doc = diagnosisInterfaceToDoc(req.body);
    await Order.findOneAndUpdate({
        user_id: doc.patient_id,
        doctor_id: doc.doctor_id,
        status: "TRADE_SUCCESS"
    }, {
        $set: {
            status: "TRADE_FINISHED"
        }
    });
    console.log(doc);

    await Diagnosis.insertMany(doc);

    let r = {
        status: 100,
        msg: "诊断结果上传成功！"
    };

    console.log(r);
    res.json(r);
});


module.exports = router;
