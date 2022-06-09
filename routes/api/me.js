const express = require("express"),
    router = express.Router(),
    consts = require("./consts");

const Admin = require("../../models/admin"),
    Department = require("../../models/department"),
    Doctor = require("../../models/doctor");

router.get('/', async (req, res, next) => {
    let fail = { status: 401, msg: "not logged in", data: {
        isLogin: false,
    }, errorMessage: "请先登录" };
    let u = req.session.user;
    if (u === undefined || u === null) {
        console.log(fail);
        res.status(401);
        res.json(fail);
        return;
    }
    console.log(u)
    let r = {};
    if (u.role == consts.role.admin) {
        let a = await Admin.findOne({ adminis_un: u.id });
        r = {
            success: true,
            status: 100,
            msg: "success",
            data: {
                // ...a,
                role: "admin",
                name: a.name,
                id: a.adminis_un,
                gender: "admin-gender",
                age: 0,
                position: "admin-position",
                department: "admin-department",
                access: u.role,
                avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            }
        };
    } else if (u.role == consts.role.doctor) {
        let doctor = await Doctor.findOne({ doctor_id: u.id });
        // TODO: YANGRQ modified here
        let department = await Department.findById(doctor.department_id);
        r = {
            success: true,
            status: 100,
            msg: "success",
            data: {
                // ...d
                role: "doctor",
                name: doctor.name,
                id: doctor.doctor_un, // use doctor_un instead of doctor_id
                gender: doctor.gender,
                age: doctor.age,
                position: doctor.position,
                department: department.name,
                access: u.role,
                avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            }
        };
    } else {
        res.status(401);
        r = fail;
    }

    console.log(r);
    res.json(r);
});

module.exports = router;