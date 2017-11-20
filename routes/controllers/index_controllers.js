var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');


/* GET home page. */

module.exports.index_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };

    mongoose.connect(uri, options);
    
    Book.find({},'title').exec(function(err, books){

        if(err) throw err;
        
        res.render('home', {title: "Home", books: books});
        
    });
    
    
};