'use strict';

var express = require('express');
var producer = require('./producer');
var consumer = require('./consumer');

var router = express.Router();

router.post('/createJobToProcess', producer.createJobToProcess)

module.exports = router;