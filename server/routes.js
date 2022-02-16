/**
 * Main application routes
 */

 'use strict';
 var cookieParser = require('cookie-parser')
 
 module.exports = function (app) {
   app.use(cookieParser());
   app.use('/api/cryptoPair', require('./api/cryptoPair'));
   app.use('/api/fetchData', require('./api/fetchData'));
  
   // All other routes should redirect to the index.html
   app.route('/*')
     .get(function (req, res) {
       res.sendfile(app.get('appPath') + '/index.html');
     });
 };
 