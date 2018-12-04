var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema =  Schema( {
    user : String,
    email: String,
    pass: String,
    country: String,
    name: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;