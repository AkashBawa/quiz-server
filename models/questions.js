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
            type : time,
            required : true
        },

        questions : [
            {
                question : {type : String, required : true},
                rightAnswer: {type : Number, required : true},      // index
                rightValue: {type : String, required : true},       // value
                options : [{values : String}],
                type : {type : String , required : true}            // mcq or others
            }
        ]   
    },
    {timestamps : true}
)

module.exports = mongoose.model('quizlist', quiz)