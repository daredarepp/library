var mongoose = require('mongoose');



/* GET home page. */

module.exports.index_get = function(req, res, next){

    res.render('home', {title: "Home"});
    
};