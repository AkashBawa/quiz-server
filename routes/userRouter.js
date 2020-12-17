const router = require('express')();
const Users = require('../models/user');
const QuizList = require('../models/questions')
const Result = require('../models/answerSheet');
//URL : /api/user/reqisterForQuiz   
router.post('/registerForQuiz/:userId', async (req, res)=>{
    const userId = req.params.userId;
    
    if(!userId){
        return res.json({success : false, message : "Provide user id"})
    }
    if(!req.body.quizId){
        return res.json({success : false, message : "Provide quiz id"})
    }
    const quizId = req.body.quizId;

    try {
        var user = await Users.findById(userId);
        let include = await user.futureQuiz.includes(quizId);
        if(include){
            return res.json({success : false, message : "Already enrolled"})
        }
        user.futureQuiz.push(quizId);
        await user.save()
        res.json({success : true, message : "Enrolled successfully" })
    }catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
});

//URL : /api/user/updateProfile/:userId
router.post('/updateProfile/:userId',async (req, res)=>{

    console.log(req.body)
    const userId = req.params.userId;

    if(!userId){
        res.json({success : false, message : "Provide userId"})
    }
    req.checkBody('firstName', "FirstName is requires").notEmpty();
    req.checkBody('lastName', " LastName is requires").notEmpty();
    req.checkBody('dob', "DOB is requires").notEmpty();
    req.checkBody('mobileNo', "mobileNo is requires").notEmpty();
    req.checkBody('email', "email is requires").isEmail();
    req.checkBody('gender', "Gender is requires").notEmpty();

    let err = req.validationErrors();

    if(err){
        res.status(200).json({success : false, msg : err});
        return;
    }
    try {
        var user = await Users.findById(userId);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        if(user.email != req.body.email){
            user.email = req.body.email;
            user.emailConfirm = false;
        }
        if(user.mobileNo != req.body.mobileNo){
            user.mobileNo = req.body.mobileNo;
            user.phoneConfirm = false;
        }
        user.dob = req.body.dob;
        user.gender = req.body.gender;

        await user.save();
        return res.json({success : true, message : "Profile updated"})

    }catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
    

});

//URL : /api/user/userDetailById/:userId
router.get('/userDetailById/:userId', async(req, res)=>{
    const userId = req.params.userId;
    if(!userId){
        return res.json({success : false, message : "provide userId"})
    }
    try{
        const user = await Users.findById(userId);
        return res.json({success : true, data : user})
    } catch(e){
        return res.json({success : false, message : "something went wrong", err: e})
    }
})
//URL : /api/user/upcomingQuiz/:userId
router.get('/upcomingQuiz/:userId', async(req, res)=>{
    const userId = req.params.userId;
    if(!userId){
        return res.json({success : false, message : "Provide user Id"});
    }
    try{
        const user = await Users.findById(userId).populate('futureQuiz');
        return res.json({success : true, data : user.futureQuiz})
    }catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
    
})
//URL : /api/user/savequiz/:userId
router.post('/savequiz/:userid', async(req, res)=>{
    let userid = req.params.userid;
    if(!userid){
        return res.json({success : false, message : "Provide user id"});
    }
    if(!req.body.quizId){
        return res.json({success : false, message : "Provide quizId"});
    }
    if(!req.body.questionAttempted){
        return res.json({success : false, message : "Provide questionAttempted"});
    }
    if(!req.body.markedAns){
        return res.json({success : false, message : "Provide markedAns"});
    }

    try {
        const quizId = req.body.quizId;
        var user = await Users.findById(userid)

        if(!user){
            return res.json({success : false, message : "No such user found"})
        }

        if(user.pastQuiz.includes(quizId)){
            return res.json({success : false, message : "Response already saved"});
        }
        
        if(!user.futureQuiz.includes(quizId)){
            return res.json({success : false, message : "You are not registered"})
        }

        const currentQuiz = await QuizList.findById(req.body.quizId);

        if(!currentQuiz){
            return res.json({success : false, message : "No such quiz found"})
        }
        var marks = 0;

        for(let i = 0; i < currentQuiz.questionArray.length; i++){
            if(req.body.markedAns[i] == currentQuiz.questionArray[i].correctIndex){
                marks++;
            }
        }

        const result = new Result({
            ...req.body,
            markesObtained : marks,
            userId : userid
        });

        
        await result.save();
        
        let ind = user.futureQuiz.indexOf(quizId);
        user.futureQuiz.splice(ind , 1);
        user.pastQuiz.push(quizId);
        await user.save();
        
        return res.json({success : true, message : "Result saved"})
        

    } catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
})
//URL : /api/user/pastQuizDetails/:userId
router.get('/pastQuizDetails/:userId', async(req, res)=>{
    
    const userId = req.params.userId;
    if(!userId){
        return res.json({success : false, message : "Provide userId"})
    }
    try {
        const user = await Users.findById(userId).populate('pastQuiz');
        return res.json({success : true, pastQuiz : user.pastQuiz})
    }catch(e){
        return res.json({success : false, message : "Something went wrong", err : e})
    }
    
})
//URL : /api/user/singleTestAnswerSheet/:userId/:quizId
router.get('/singleTestAnswerSheet/:userId/:quizId',async(req, res)=>{
    const userId = req.params.userId;
    const quizId = req.params.quizId;
    if(!userId){
        return res.json({success : false, message : "Provide userId"})
    }
    if(!quizId){
        return res.json({success : false, message : "Provide quizId"})
    }
    try {  
        const quiz = await QuizList.findById(quizId);
        const answerSheet = await Result.findOne({"quizId" : quizId , "userId": userId})
        console.log(answerSheet);
        return res.json({success : true, data : {quiz , answerSheet}})

    }catch(e){
        return res.json({success : false , message : "Something went wrong"})
    }
    
})

module.exports = router