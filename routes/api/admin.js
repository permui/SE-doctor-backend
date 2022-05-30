const express = require("express"),
    router = express.Router();

const Admin = require("../../models/adminis"),
    Doctor = require("../../models/doctor");


// // not completed
// router.post('/schedule/upload', async(req, res, next) => {
//     console.log("into /schedule/upload")
//     let _schedule_id = req.body.schedule_id;
//     let _department = req.body.department;
//     let _time = req.body.time;
//     let _doctor_id = req.body.doctor_id;

//     // modified

//     await Admin.findOneAndUpdate({
//         doctor_id: _doctor_id
//     }, {
//         $set: {
//             name: _doctor_name,
//             gender: _gender,
//             age: _age,
//             dept_id: _department, // should not be uuidv4 here?
//             photo: _photo,
//             position: _position
//         }
//     }, {}, function(err, data) { //debug function
//         if (err) {
//             console.log('Error in database')
//         } else if (!data) {
//             console.log('Not such data')
//             console.log(data)
//         } else {
//             console.log('Modify data success')
//             console.log(data)
//         }
//     });

//     let r = {
//         status: 100,
//         msg: "success",
//         data: {}
//     };

//     console.log(r);
//     res.json(r);
// });

// post: info_change
router.post('/doctor/info_change', async(req, res, next) => {
    console.log("into /doctor/info_change")
    let _doctor_id = res.body.doctor_id;
    let _department = res.body.department;
    let _position = res.body.position;

    await Doctor.findOneAndUpdate({
        doctor_id: _doctor_id
    }, {
        $set: {
            dept_id: _department,
            position: _position
        }
    }, {}, function(err, data) { //debug function
        if (err) {
            console.log('Error in database')
        } else if (!data) {
            console.log('Not such data')
            console.log(data)
        } else {
            console.log('Modify data success')
            console.log(data)
        }
    });

    let r = {
        status: 100,
        msg: "success",
        data: {}
    };

    console.log(r);
    res.json(r);
})
module.exports = router;