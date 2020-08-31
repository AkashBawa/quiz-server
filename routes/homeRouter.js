const express = require('express');
const router = express();
const bcrypt = require('bcrypt');


var users = [];
// check server //

router.get('/', async(req, res)=>{
  console.log("reached");
  res.send("hello world")
})

//----------  URL : /api/home/login ------------//
router.post('/login', async(req, res)=>{
    console.log("login in index", req.body);
    console.log(users)
    const user = users.find(u => u.email = req.body.email);
    if(!user){
        return res.send("no user found")
    }
    try{

      if(await bcrypt.compare( req.body.password, user.password )) {
        return res.send("success")
      }else {
        return res.send("Not matched")
      }
    }catch(err){
        return res.send("login")
    }
    
})

//----------  URL : /api/home/signup ------------//
router.post('/signup', async (req, res)=>{
    console.log(req.body); 
    const hashedpass = await bcrypt.hash(req.body.password, 10)
    console.log(users)
    let userData = {
        name : "akash",
        email : req.body.email,
        password : hashedpass
    }
    console.log(userData)
    users.push(userData);
    return res.json({success : true})
   
})

module.exports = router