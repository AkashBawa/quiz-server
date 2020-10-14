var express = require('express');
var router = express.Router();

const homeRouter = require('./homeRouter')
const createQuiz = require('./createQuiz')

//-------  URL : /api/ * ---------//

router.use('/home', homeRouter)

router.use('/admin', createQuiz)

module.exports = router;
