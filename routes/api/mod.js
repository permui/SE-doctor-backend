"use strict";

const express = require("express"),
    router = express.Router(),
    userRouter = require('./user'),
    doctorRouter = require('./doctor'),
    announceRouter = require('./announce'), //,
    adminisRouter = require('./admin'),
    registerRouter = require('./register'),
    meRouter = require('./me');

router.use('/user', userRouter);
router.use('/doctor', doctorRouter);
router.use('/announce', announceRouter);
router.use('/admin', adminisRouter);
router.use('/register', registerRouter);
router.use('/me', meRouter);

module.exports = router;