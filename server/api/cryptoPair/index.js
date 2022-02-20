'use strict';
var express = require('express');
var router = express.Router();

var controller = require('./cryptoPair.controller');

//add the endpoints

router.post('/addCryptoPair', controller.addCryptoPair)
router.post('/removeTrackedPair', controller.removeTrackedPair)

module.exports = router;