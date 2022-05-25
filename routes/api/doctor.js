const express = require('express'),
    router = express.Router();

const Doctor = require('../../models/doctor');

router.get('/info/details', async (req, res, next) => {
    let id = req.query.doctor_id;
    let data = await Doctor.findOne({ doctor_id: id });
    let r = {
        status: 100,
        msg: "success",
        data: data
    };
    console.log(r);
    res.json(r);
});

module.exports = router;