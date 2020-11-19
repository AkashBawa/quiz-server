const router = require('express')();
const Quiz = require('../models/questions');

// URL : /api/admin/createquiz
router.post('/createquiz',async (req, res)=>{

    console.log("body is : ", req.body);

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('date', 'date is required').notEmpty();
    req.checkBody('time', 'time is required').notEmpty();
    req.checkBody('questionArray', 'Questions are required').notEmpty();

    try{

        const quiz =  new Quiz({
            ...req.body
        });
    
        await quiz.save();

    } catch(e){
        console.log("error is", e);
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