const mongoose = require('mongoose');


const quiz = new mongoose.Schema(
    {
        createdBy : {
            type : mongoose.SchemaTypes.ObjectId
        },

        name :{
            type : String,
            required: true
        },

        date : {
            type :Date,
            required : true
        },

        time : {
            type : Date,
            required : true
        },

        questionArray : [
            {
                question : {type : String, required : true},
                correctIndex: {type : Number, required : true},      // index
                correctAns: {type : String, required : true},       // value
                options : [ {type : String, require : true}],
                type : {type : String , required : true}            // mcq or others
            }
        ]   
    },
    {timestamps : true}
)

module.exports = mongoose.model('quizlist', quiz)