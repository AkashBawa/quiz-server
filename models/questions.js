const mongoose = require('mongoose');


const quiz = new mongoose.Schema(
    {
        createdBy : {
            type : String
        },
        teacherId : {
            type : Number,                  //used for URL : /test/teacherId/testId
            required : true
        },
        testId : {
            type :  Number,
            required : true
        },

        name :{
            type : String,
            required: true
        },

        date : {
            type :String,
            required : true
        },

        time : {
            type : String,
            required : true
        },

        questionArray : [
            {
                question : {type : String, required : true},
                correctIndex: {type : Number},      // index
                correctAns: {type : String},       // value
                options : [ {type : String, require : true}],
                type : {type : String , required : true}            // mcq or others
            }
        ]   
    },
    {timestamps : true}
)

module.exports = mongoose.model('quizlist', quiz)