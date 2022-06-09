const express = require("express"),
    router = express.Router(),
    consts = require('./consts');

const Admin = require("../../models/admin"),
    Doctor = require("../../models/doctor");

async function checkUser(id, password) {
    console.log(id, password);
    let unp = { role: consts.role.unprivileged };
    if (id[0] == 'A') {
        let a = await Admin.findOne({ adminis_un: id });
        if (a === null || a.password != password) return unp;
        return { role: consts.role.admin, id: id };
    } else if (id[0] == 'D') {
        let d = await Doctor.findOne({ doctor_un: id });
        // let d = await Doctor.findOne({ name : id });
        if (d === null || d.password != password) return unp;
        return { role: consts.role.doctor, id: id };
    } else return unp;
}

router.post('/login', async (req, res, next) => {
    console.log(req.body);
    let user = await checkUser(req.body.id, req.body.secret);
    let r = {};
    if (user.role == consts.role.unprivileged) {
        r = {
            status: 201,
            msg: "login fail",
            data: {}
        };
    } else if (user.role == consts.role.admin || user.role == consts.role.doctor) {
        r = {
            status: 100,
            msg: "login success",
            data: {}
        };
        req.session.user = user;
    }

    console.log(r);
    res.json(r);
});

router.post('/logout', (req, res, next) => {
    req.session.user = { role: consts.role.unprivileged };
    r = {
        status: 100,
        msg: "logged out",
        data: {}
    };
    console.log(r);
    res.json(r);
})

module.exports = router;