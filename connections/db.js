if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');

const URL = process.env.DATABASE_URL

const connection = async()=>{
    try {
        await mongoose.connect(URL,{ useNewUrlParser : true, useUnifiedTopology : true});
        console.log("database connected")
    }catch(err){
        console.log("Error occur while connectiong to database" , err)
    }
}

module.exports = connection