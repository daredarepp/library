var express = require('express');
var router = express.Router();
var catalog_controllers = require('./controllers/catalog_controllers');


/* GET admin page. */

router.get('/', catalog_controllers.catalog_get);

/*  GET category  */

router.get('/:category', catalog_controllers.catalog_category_get);



module.exports = router;