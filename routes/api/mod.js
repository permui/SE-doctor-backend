"use strict";

const express = require("express"),
    router = express.Router(),
    doctorRouter = require('./doctor');

router.use('/doctor', doctorRouter);

module.exports = router;