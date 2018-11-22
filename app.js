var express = require('express');
var app = express();

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