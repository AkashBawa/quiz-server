// import {nanoid} from 'nanoid'
// var { nanoid } = require("nanoid");
// // var ID = nanoid(10 );
// console.log("nano id : ", ID);

var { customAlphabet } = require('nanoid/async')
const nanoId = customAlphabet('1234567890', 10)

const router = require('express')();
const Quiz = require('../models/questions');

// URL : /api/admin/createquiz
router.post('/createquiz',async (req, res)=>{

    console.log("body is : ", req.body);
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('date', 'date is required').notEmpty();
    req.checkBody('time', 'time is required').notEmpty();
    req.checkBody('questionArray', 'Questions are required').notEmpty();

    let err = req.validationErrors();

    if(err){
        return res.json({success : false, message : 'Something went wrong', msg : err})
    }
    let time = req.body.time;

    let hour = time.slice(0, 2);
    let minutes = time.slice(3);

    req.body.time = new Date(req.body.date);
    req.body.time.setHours(hour, minutes)
    
    var testId = await nanoId();
    try{

        const quiz =  new Quiz({
            ...req.body,
            quizId : testId
        });
    
        await quiz.save();
        return res.json({success : true, message : "Saved"})
        
    } catch(e){
        return res.json({success : false, message : e});
    }
})

router.get("/allquiz",async(req, res)=>{


    try{
        const quiz = await Quiz.find({});

        return res.json({success : true, data : quiz});

    } catch(e){

        console.log("err is : ", e);
        return res.json({success : false, e : e})
    }
})

router.get("/quizbyid", async (req, res)=>{

    if(!req.body.quizId){
        return res.json({success : false, e : "provide quiz id"})
    }

    try{

        const quiz = await new Quiz.findById(req.body.quizId);

        if(!quiz){
            return res.json({success : true, message : "No quiz found", data : []})
        } else {
            return res.json({success : true,  data : quiz})
        }

    } catch(e){

        console.log("err is : ", e);
        return res.json({success : false, e : e})
    }
    
})

router.get('/quizbydate', async (req, res)=>{
    console.log("quiz by date");
})

module.exports = router