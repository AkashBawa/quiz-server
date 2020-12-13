const mongoose = require('mongoose');

const ans = mongoose.Schema({

    quizId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true
    },

    userId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true
    },

    questionAttempted : {type : Number},

    markedAns : [Number],

    markesObtained : {type : Number}
})

module.exports = mongoose.model('answerSheet', ans)