const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.generateToken = async (data)=>{
    const tokenUrl = process.env.TOKEN_GENERATOR;
    try{
        const userToken = jwt.sign(data, tokenUrl)
        return userToken;
    } catch(e){
        console.log(e);
        return false;
    }   
}

module.exports.verifyToken = async(data)=>{
    const tokenUrl = process.env.TOKEN_GENERATOR;
    try {
        const decoded = jwt.verify(data, tokenUrl)
        return decoded;
    } catch(err){
        console.log(err);
        return false;
    }
}