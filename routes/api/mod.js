"use strict";

const express = require("express"),
    router = express.Router(),
    doctorRouter = require('./doctor'),
    announceRouter = require('./announce'); //,
// registerRouter = require('./register');

router.use('/doctor', doctorRouter);
router.use('/announce', announceRouter);
// router.use('/register', registerRouter);

module.exports = router;