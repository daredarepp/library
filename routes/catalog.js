var express = require('express');
var router = express.Router();
var catalog_controllers = require('./controllers/catalog_controllers');


/* GET admin page. */

router.get('/', catalog_controllers.catalog_get);

/*  GET Books  */

router.get('/books', catalog_controllers.catalog_books_get);

/* GET Authors */

router.get('/authors', catalog_controllers.catalog_authors_get);

/* GET Genres */

router.get('/genres', catalog_controllers.catalog_genres_get);




module.exports = router;