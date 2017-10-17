var express = require('express');
var router = express.Router();
var index_controllers = require('./controllers/index_controllers');


/* GET home page. */

router.get('/', index_controllers.index_get);


module.exports = router;
