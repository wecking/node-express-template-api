var configValues = require('./config');
var fs = require('fs');

var date = new Date();

var currentDate = date.getDate() + "-"
    + (date.getMonth()+1)  + "-"
    + date.getFullYear();

var datetime = "Last Sync: " + currentDate + " @ "
    + date.getHours() + ":"
    + date.getMinutes() + ":"
    + date.getSeconds();
const logDir = __dirname.replace('config', '') + 'logs/bug-' +
    currentDate + '.log';



module.exports = {
    getDbConnectionString : function (){
        return 'mongodb://' + configValues.username + ':'
         + configValues.password +
            '@ds041347.mlab.com:41347/todo12345678';
    },

    logBug : function (req, err) {
        //Create crash report write stream
        var report = datetime + '\n' + JSON.stringify(req.body) + '\n' + err.toString();
        var log_file = fs.createWriteStream(logDir, {flags : 'a'});
        log_file.write('\n' + '\n' + report);
    }

};