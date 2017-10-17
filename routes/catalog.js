var express = require('express');
var router = express.Router();
var catalog_controllers = require('./controllers/catalog_controllers');


/* GET admin page. */

router.get('/', catalog_controllers.catalog_get);


module.exports = router;