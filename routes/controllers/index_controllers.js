var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');

/* GET home page. */

module.exports.index_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };

    mongoose.connect(uri, options);
    
    // Books
    Book.find({},'title').exec(function(err, books){

        if(err) throw err;
        
        // Authors
        Author.find({}, 'first_name family_name').exec(function(err, authors){

            if (err) throw err;

            
            res.render('home', {title: "Home", books: books, authors: authors});
            
        });
        
    });

};