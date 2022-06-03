const express = require("express"),
    router = express.Router(),
    consts = require("./consts");

const Admin = require("../../models/admin"),
    Doctor = require("../../models/doctor");

router.get('/', async (req, res, next) => {
    let fail = { status: 202, msg: "not logged in", data: {} };
    let u = req.session.user;
    if (u === undefined || u === null) {
        console.log(fail);
        res.json(fail);
        return;
    }
    let r = {};
    if (u.role == consts.role.admin) {
        let a = await Admin.findOne({ adminis_id: u.id });
        r = {
            status: 100,
            msg: "success",
            data: a
        };
    } else if (u.role == consts.role.doctor) {
        let d = await Doctor.findOne({ doctor_id: id });
        r = {
            status: 100,
            msg: "success",
            data: d
        };
    } else r = fail;

    console.log(r);
    res.json(r);
});

module.exports = router;