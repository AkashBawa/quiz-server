const router = require('express')();
const Users = require('../models/user');

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

module.exports = router