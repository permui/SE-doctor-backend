"use strict";

const express = require("express"),
    router = express.Router(),
    doctorRouter = require('./doctor'),
    announceRouter = require('./announce');

router.use('/doctor', doctorRouter);
router.use('/announce', announceRouter);

module.exports = router;