const mongoose = require('mongoose');


const quiz = new mongoose.Schema(
    {
        createdBy : {
            type : mongoose.SchemaTypes.ObjectId
        },
        createdByName : {
            type : String
        },
        quizId :{type : String, required : true},

        name :{
            type : String,
            required: true
        },

        date : {
            type :Date,
            required : true
        },

        time : {
            type : String,
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
        ],   
    },
    {timestamps : true}
)

module.exports = mongoose.model('quizlist', quiz)