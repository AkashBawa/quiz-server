var express = require('express');
var router = express.Router();

const homeRouter = require('./homeRouter')
const createQuiz = require('./createQuiz')
const userRouter = require('./userRouter')

//-------  URL : /api/home * ---------//
router.use('/home', homeRouter)

//-------  URL : /api/admin * ---------//
router.use('/admin', createQuiz)

//-------  URL : /api/user * --------
router.use('/user', userRouter)
module.exports = router;
