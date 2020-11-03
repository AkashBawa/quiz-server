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

        const quiz = new Quiz({
            ...req.body
        });
    
        await quiz.save();

    } catch(e){
        console.log("error is", e);
    }
})

router.get("/allquiz",async(req, res)=>{

    console.log("req");

})

router.get("/quizbyid", async (req, res)=>{

    console.log("quiz by id");
    
})

router.get('/quizbydate', async (req, res)=>{
    console.log("quiz by date");
})

module.exports = router