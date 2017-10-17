var express = require('express');
var router = express.Router();
var admin_controllers = require('./controllers/admin_controllers');


/* GET admin page. */

router.get('/', admin_controllers.admin_get);


module.exports = router;