const mongoose = require('mongoose');
const path = require('path');
const profileImgPath = "uploads/profilepic"
const bcrypt = require('bcrypt');

var uniqueValidator = require('mongoose-unique-validator');

const user = new mongoose.Schema({

    quizAppId : {
        type : String,                       // custom
        required : true
    },
    
    firstName : {
        type : String, 
        required : true , 
        lowercase : true
    },

    lastName : {
        type : String, 
        required : true, 
        lowercase : true
    },

    email : {
        type : String, 
        required : true, 
        unique : true, 
        lowercase : true
    },

    dob : { type : String, required : true},

    password : { type : String, required : true},

    mobileNo : { 
        type : Number,
        required : true,
        unique :true
    },

    otherToken : { type : String },           // token that we receive from google or facebook

    ownToken : { type : String},             // own generated token using jwt

    profilePic : { type : String},              

    provider : { type : String, required : true},    // social or local

    emailConfirm : { type : Boolean, default : false },

    phoneConfirm : { type : Boolean, default : false},

    role : { type : String, default : 'student'                     // student || admin || teacher
    },

    gender : {type : String, required : true},

    pastQuiz : [{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'quizlist'
    }],

    futureQuiz : [{
        type : mongoose.SchemaTypes.ObjectId,
        ref : 'quizlist'
    }]
    
})

user.plugin(uniqueValidator)

module.exports = mongoose.model('user', user)

module.exports.createHash = async function(user){
    try{
        let hash = await bcrypt.hash(user.password, 10)
        return hash;
    }catch(err){
        return null
    }
}

module.exports.comparepassword = async function(newpass, oldpass){
    try{
        let result = await  bcrypt.compare(newpass, oldpass)
        return result;
    } catch(err){
        return false
    }
}
// module.exports.profileImgPath = profileImgPath