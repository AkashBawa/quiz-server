const router = require('express')();

router.post('/createquiz',(req, res)=>{
    console.log(req.body);
})

module.exports = router