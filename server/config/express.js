/**
 * Express configuration
 */

 'use strict';

 var express = require('express');
 var bodyParser = require('body-parser');
 var errorHandler = require('errorhandler');
 var path = require('path');
 var config = require('./environment');
 var mongoose = require('mongoose');
 
 //var client = require('../postgres').client;
 
 module.exports = function(app) {
   var env = app.get('env');
   app.set('views', config.root + '/server/views');
   app.set('view engine', 'html');
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(bodyParser.json());
   
 
  
     app.use(express.static(path.join(config.root, '.tmp')));
     app.use(errorHandler()); // Error handler - has to be last
 };
 