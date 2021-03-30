const mongoose  = require('mongoose');

const Userschema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true.valueOf,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avatar : {
        type : String
    },
    date : {
        type : Date,
        default : date.now
    }
});

module.exports = User = mongoose.model('user',Userschema);