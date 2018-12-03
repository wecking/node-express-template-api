var http = require('http');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
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

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.use(cookieParser());
app.set('env', 'development');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//setup app
var apiController = require('./controller/apiController');
var config = require('./config');
var mongoose = require('mongoose');
var setUpController =
    require('./controller/setupController');

// build mongo database connection url //
process.env.DB_HOST = process.env.DB_HOST || 'ds041347.mlab.com'
process.env.DB_PORT = process.env.DB_PORT || 41347;
process.env.DB_NAME = process.env.DB_NAME || 'todo12345678';

if (app.get('env') === 'live'){
    process.env.DB_URL = 'mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT;
}	else {
// prepend url with authentication credentials //
    process.env.DB_URL = config.getDbConnectionString();
}

app.use('/assets', express.static(__dirname + '/public'));

// mongoose.connect(config.getDbConnectionString(),
//     { useNewUrlParser: true });

app.use(session({
        secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
        proxy: true,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({ url: process.env.DB_URL })
    })
);

require('./controller/user')(app);

setUpController(app);
apiController(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;