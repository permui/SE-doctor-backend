const express = require("express"),
    router = express.Router(),
    consts = require("./consts");

const Admin = require("../../models/admin"),
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
        let a = await Admin.findOne({ adminis_id: u.id });
        r = {
            success: true,
            status: 100,
            msg: "success",
            data: {
                // ...a,
                role: "admin",
                name: a.name,
                id: a.adminis_id,
                gender: "admin-gender",
                age: 0,
                position: "admin-position",
                department: "管理员",
                access: u.role,
                avatar: "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            }
        };
    } else if (u.role == consts.role.doctor) {
        let d = await Doctor.findOne({ doctor_id: u.id });
        r = {
            success: true,
            status: 100,
            msg: "success",
            data: {
                // ...d
                role: "doctor",
                name: d.name,
                id: d.doctor_id,
                gender: d.gender,
                age: d.age,
                position: d.position,
                department: d.dept_id,
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