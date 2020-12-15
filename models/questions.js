const mongoose = require('mongoose');


const quiz = new mongoose.Schema(
    {
        createdBy : {
            type : mongoose.SchemaTypes.ObjectId
        },
        createdByName : {
            type : String
        },
        quizId :{type : String, required : true},           // custom id

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
        ],   
    },
    {timestamps : true}
)

module.exports = mongoose.model('quizlist', quiz)