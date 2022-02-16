const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path')
const mongoose = require('mongoose');
const config = require('./config/environment');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname)); 

mongoose.connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

const port = process.env.PORT || '8080';
app.set('port', port);

const server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);
server.listen(port, function () {
    console.info(`Server is up and running on port ${port}`)
});

exports = module.exports = app; 
