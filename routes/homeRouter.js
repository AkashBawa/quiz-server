const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const Users = require('../models/user')
const multer = require('multer')
const path = require('path');
const fs = require('fs')
//---------multer integration----------//
const imgType = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
// const uploadpath = path.join('public', Users.profileImgPath )

// const upload = multer({
//   dest : uploadpath,
//   fileFilter : (req, file, callback)=>{
//     callback(null, imgType.includes(file.mimetype))
//   }
// })


// check server //


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
      res.status(200).json({success : true, data : user})
      return;
    } else {
      res.status(200).json({success : false, message : "Password not match"});
      return  
    }
  } catch(err){
    res.status(200).json({success : false, msg : "Something went wrong"})
  }
  
})

//----------  URL : /api/home/signup ------------//
router.post('/signup' ,async (req, res)=>{

    console.log("signup reach")
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
      }
      user.password = hash;
      let newUser = await user.save();
      return res.json({success : true, newUser})

    } catch(err){
      return res.json({success : false, err : err})
    }
})

// function removeProfilePic(picName){
//   console.log("unlink profile :" , picName)
//   fs.unlink(path.join(uploadpath, picName), err=>{
//     if(err)
//       console.log("err while unlink file : ",  err)
//   })
// }
module.exports = router