var express = require('express');
var router = express.Router();
var admin_controllers = require('./controllers/admin_controllers');


/* GET admin page. */

router.get('/', admin_controllers.admin_get);

/* Delete items from database */
router.post('/remove/:category/:id', admin_controllers.delete_items)

module.exports = router;