if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');

const URL = process.env.DATABASE_URL

const connection = async()=>{
    try {
        mongoose.connect(URL,{ useNewUrlParser : true, useUnifiedTopology : true});
        const db = mongoose.connection;
        db.on('error', error => console.log(error))
        db.once('open', () => console.log("connected to mongoose"))
    }catch(err){
        console.log("Error occur while connectiong to database" , err)
    }
}

module.exports = connection