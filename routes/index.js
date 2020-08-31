var express = require('express');
var router = express.Router();

const homeRouter = require('./homeRouter')

//-------  URL : /api/ * ---------//
router.use('/home', homeRouter)

module.exports = router;
