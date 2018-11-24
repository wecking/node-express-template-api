var configValues = require('./config');
var fs = require('fs');

const logDir = __dirname.replace('config', '') + 'logs/bug.log';

var currentdate = new Date();
var datetime = "Last Sync: " + currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();



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