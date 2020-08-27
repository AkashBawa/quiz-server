const mongoose = require('mongoose');

const URL = "mongodb+srv://quizApp:quiz1234@quiz-cluster.bszi5.mongodb.net/<quiz-app>?retryWrites=true&w=majority";

const connection = async()=>{
    try {
        await mongoose.connect(URL,{ useNewUrlParser : true, useUnifiedTopology : true});
        console.log("database connected")
    }catch(err){
        console.log("Error occur while connectiong to database" , err)
    }
}

module.exports = connection