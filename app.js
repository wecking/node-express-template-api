var express = require('express');
var app = express();

const fs = require('fs')
const logger = require('morgan');

app.use(logger('common', {
    stream: fs.createWriteStream(__dirname + '/logs/access.log', {flags: 'a'})
}));

var apiController = require('./controller/apiController');

var config = require('./config');

var mongoose = require('mongoose');


var setUpController =
    require('./controller/setupController');


var port = process.env.PORT || 3000;


app.use('/assets', express.static(__dirname + '/public'));

mongoose.connect(config.getDbConnectionString(),
    { useNewUrlParser: true });

setUpController(app);
apiController(app);

app.listen(port);

module.exports = app;