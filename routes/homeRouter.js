const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const quizList = require('../models/questions');
const multer = require('multer')
const path = require('path');
const fs = require('fs')

const tokenController = require('../controller/jwtTokens')
const mailerController = require('../controller/mailController');

var { customAlphabet } = require('nanoid/async')
const nanoId = customAlphabet('1234567890', 6)

//---------multer integration----------//
const imgType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

const currentURL = 'http://localhost:3000'
// router.get('/', async(req, res)=>{
//   console.log("reached");
//   res.send("hello world")
// })

//----------  URL : /api/home/login ------------//
router.post('/login', async (req, res)=>{
  
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
  console.log(req.body)
  let err = req.validationErrors();

  if(err){
    res.status(200).json({success : false, err})
  }
  
  try {

    var user = await Users.findOne({email : req.body.username});
    if(!user){
      return res.json({success : false, message : "No user found"})
    }
    
    let result = await Users.comparepassword(req.body.password, user.password)

    if(result){

      if(!user.emailConfirm){
        return res.status(200).json({success : true, emailConfirm : false, 
               message : 'Please verify your email by the link sent on your email and login again.'})
      } 

      const userToken = await tokenController.generateToken(user.toJSON())

      if(userToken == false){
        return res.json({success : false, message : "something went wrong"})
      }

      return res.status(200).json({success : true,emailConfirm : true, userToken})      
    
    } else {
      res.status(200).json({success : false, message: "Password not match"});
      return  
    }
  } catch(err){
    res.status(200).json({success : false, msg : "Something went wrong", err : err})
  }
  
})

//----------  URL : /api/home/signup ------------//
router.post('/signup' ,async (req, res)=>{

  req.checkBody('firstName', "FirstName is requires").notEmpty();
  req.checkBody('lastName', " LastName is requires").notEmpty();
  req.checkBody('dob', "DOB is requires").notEmpty();
  req.checkBody('mobileNo', "mobileNo is requires").notEmpty();
  req.checkBody('email', "email is requires").isEmail();
  req.checkBody('password', "password is requires").notEmpty();
  req.checkBody('provider', "provider is requires").notEmpty();
  req.checkBody('gender', "Gender is requires").notEmpty();

  let err = req.validationErrors();

  if(err){
    res.status(200).json({success : false, message : err});
    return;
  }
try {

    var user = await Users.find({"email": req.body.email});
    console.log(user.length);

    if(user.length != 0){
      console.log("fetch user is : ", user)
      res.json({success : false, msg : "Email already exists"})
      return;
    }

    user = await Users.find({'mobileNo' : req.body.mobileNo});

    if(user.length != 0){
      res.json({success : false, msg : "Mobile number already exists"})
      return;
    }

    var userid = await nanoId();

    user = new Users({
      ...req.body,
      userId : userid
    })

    let hash = await  Users.createHash(user)

    if(hash == null ){
      console.log("reached at 1");
      res.json({success : false, message : "1"})
      return;
    }

    user.password = hash;

    if(req.body.provider != 'local'){
      user.emailConfirm = true;
      var newUser = await user.save();
      return res.json({success : true, newUser, message : 'Please login to avail our services'})
    } 
    var newUser = await user.save();
    console.log("user saved!!!!!!!!!!!!");
    
    const userToken = await tokenController.generateToken({email : newUser.email})

   let data = `Please click this link to verify your email ${newUser.email} for QuizApp : 
                  <a href="${currentURL}/api/home/verifyEmail/${userToken}">Click Here</a>`;

    const sendMail = await mailerController.sendMail(newUser.email, 'Verifing Email Address' ,data )
  
    return res.json({success : true, newUser, message : 'Please verify your email by the link sent on your email.'})
    
  } catch(err){
    return res.json({success : false, err : err, message : "the error is : "+err})
  }
})

//-----URL : /api/home/verifyEmail
router.get('/verifyEmail/:token',async (req, res)=>{

  let token = req.params.token
  try {

    const toVerify = await  tokenController.verifyToken(token);
    const user = await  Users.findOne({email : toVerify.email});
    user.emailConfirm = true;
    await user.save();

    res.status(200).json({message : "Your email is verified now"});

  } catch(err){
    res.send("Something went wrong3")
  }
})

//-----URL : /api/home/resendEmailVerification/:email
router.get('/resendEmailVerification/:email',async(req, res)=>{
  
  try{
    let email = req.params.email.toString();
    console.log(email)
    const userToken = await tokenController.generateToken({email : email})

    let data = `Please click this link to verify your email ${email} for QuizApp : 
                  <a href="${currentURL}/api/home/verifyEmail/${userToken}">Click Here</a>`;

    await mailerController.sendMail(email, 'Verifing Email Address' ,data )
  
    return res.json({success : true, message : 'Verification link send'})

  }catch(err){
    console.log(err)
    return res.json({success : false, message : 'Something went wrong4'})
  }
    
})

//-----URL : /api/home/detailFromToken
router.get('/detailFromToken/:token', async (req, res)=>{
  
  let token = req.params.token
  try {

    const toVerify = await tokenController.verifyToken(token);

    if(toVerify) {
      res.status(200).json({data : toVerify, success : true})
      return;
    } else {
      res.status(200).json({success : false});
      return;
    }

  } catch(err){
    res.send("Something went wrong")
  }
})

router.post('/addQuiz',async (req,res)=>{
  console.log("reached at addQuiz ",req.body);

  /*last_testId =await quizList.find().sort({testId : -1}).limit(1);
  console.log("last test id : ",last_testId);
  new_testId = last_testId + 1;
  console.log("new test id : ",new_testId);

  new_quiz = quizList({
    ...req.body
  })

  new_quiz.testId = new_testId;
*/
new_quiz = quizList({
  'createdBy' : req.body.createdBy,
  'teacherId' : req.body.teacherId,
  'testId' : 1056,
  'name' : req.body.name,
  'date' : req.body.date,
  'time' : req.body.time,
  
})
  var saved_quiz = await new_quiz.save()
  console.log("saved quiz is : ", saved_quiz);
  return res.json({success : true, message : 'quiz saved'});
})

module.exports = router