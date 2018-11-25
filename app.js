var express = require('express');
var app = express();

const fs = require('fs')
const logger = require('morgan');

//Setup swagger documentation UI
var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.use('/api/v1', router);

//get date for creating log file by date
var date = new Date();
var currentDate = date.getDate() + "-"
    + (date.getMonth()+1)  + "-"
    + date.getFullYear();
const logDir = __dirname.replace('config', '') + '/logs/access-' +
    currentDate + '.log';
app.use(logger('common', {
    stream: fs.createWriteStream(logDir, {flags: 'a'})
}));

//setup app
var apiController = require('./controller/apiController');
var config = require('./config');
var mongoose = require('mongoose');
var setUpController =
    require('./controller/setupController');




app.use('/assets', express.static(__dirname + '/public'));

mongoose.connect(config.getDbConnectionString(),
    { useNewUrlParser: true });

setUpController(app);
apiController(app);

var port = process.env.PORT || 3000;
app.listen(port);

module.exports = app;