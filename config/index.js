var configValues = require('./config');


module.exports = {
    getDbConnectionString : function (){
        return 'mongodb://' + configValues.username + ':'
         + configValues.password +
            '@ds041347.mlab.com:41347/todo12345678';
    }

};