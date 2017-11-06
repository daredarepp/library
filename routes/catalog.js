var express = require('express');
var router = express.Router();
var catalog_controllers = require('./controllers/catalog_controllers');


/* GET catalog index page. */

router.get('/', catalog_controllers.catalog_get);

/*  GET category */

router.get('/:category', catalog_controllers.catalog_category_get);

/* GET single item */

router.get('/:category/:id', catalog_controllers.catalog_item_get)


module.exports = router;