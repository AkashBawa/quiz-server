const mongoose = require('mongoose');
const path = require('path');
const profileImgPath = "uploads/profilepic"
const bcrypt = require('bcrypt');

var uniqueValidator = require('mongoose-unique-validator');
const { use } = require('../routes/homeRouter');
const { strict } = require('assert');

const user = new mongoose.Schema({

    firstName : {type : String, required : true , lowercase : true},
    lastName : {type : String, required : true, lowercase : true},
    email : {type : String, required : true, unique : true, lowercase : true},
    dob : {type : String, required : true},
    password : {type : String, required : true},
    mobileNo : { type : Number, required : true, unique :true},
    otherToken : {type : String},
    ownToken : {type : String},
    profilePic : {type : String},
    provider : {type : String, required : true},
    gender : {type : String, required : true}
    
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