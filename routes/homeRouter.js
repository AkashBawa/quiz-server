const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const Users = require('../models/user')
const multer = require('multer')
const path = require('path');
const fs = require('fs')

const tokenController = require('../controller/jwtTokens')
const mailerController = require('../controller/mailController');
const user = require('../models/user');
//---------multer integration----------//
const imgType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

const currentURL = 'http://localhost:3000'
router.get('/', async(req, res)=>{
  console.log("reached");
  res.send("hello world")
})

//----------  URL : /api/home/login ------------//
router.post('/login', async (req, res)=>{
  
  req.checkBody('username', 'username is required').notEmpty();
  req.checkBody('password', 'password is required').notEmpty();
 
  let err = req.validationErrors();

  if(err){
    res.status(200).json({success : false, err})
  }
  // query = query.regex('name', new RegExp(name, 'i'));
  // query = query.lte('properyName', "properyValue")
  // const user = await query.exec();

  try {

    var user = await Users.findOne({email : req.body.username});

    
    let result = await Users.comparepassword(req.body.password, user.password)

    if(result){

      if(!user.emailConfirm){
        return res.status(200).json({success : true, emailConfirm : false, 
               message : 'Please verify your email by the link sent on your email.'})
      } 
      return res.status(200).json({success : true,emailConfirm : true, data : user})
      
    } else {
      res.status(200).json({success : false, message: "Password not match"});
      return  
    }
  } catch(err){
    res.status(200).json({success : false, msg : "Something went wrong"})
  }
  
})

//----------  URL : /api/home/signup ------------//
router.post('/signup' ,async (req, res)=>{

  console.log("signup reach", req.body)
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
    res.status(200).json({success : false, msg : err});
    return;
  }

  const user = new Users({
    ...req.body
  })

  try {

    let hash = await  Users.createHash(user)

    if(hash == null ){
      res.json({success : false, msg : "Something went wrong"})
      return;
    }

    user.password = hash;

    if(req.body.provider != 'local'){
      user.emailConfirm = true;
      var newUser = await user.save();
      return res.json({success : true, newUser, message : 'Please login to avail our services'})
    } 
    var newUser = await user.save();
    
    const userToken = await tokenController.generateToken({email : newUser.email})

   let data = `Please click this link to verify your email ${newUser.email} for QuizApp : 
                  <a href="${currentURL}/api/home/verifyEmail/${userToken}">Click Here</a>`;

    const sendMail = await mailerController.sendMail(newUser.email, 'Verifing Email Address' ,data )
  
    return res.json({success : true, newUser, message : 'Please verify your email by the link sent on your email.'})
    
  } catch(err){
    return res.json({success : false, err : err, message : 'Something went wrong'})
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
    res.send("Something went wrong")
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
    return res.json({success : false, message : 'Something went wrong'})
  }
    
})

module.exports = router