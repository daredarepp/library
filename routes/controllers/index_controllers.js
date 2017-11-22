var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');

/* GET home page. */

module.exports.index_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };

    mongoose.connect(uri, options);
    
    var booksPromise = Book.find({}, 'title').exec();
    var authorsPromise = Author.find({}, 'first_name family_name').exec();
    
    Promise.all([booksPromise, authorsPromise]).then(function([books, authors]){

        res.render('home', {title: "Home", books: books, authors: authors});

    }).catch(function(err){

        console.log(err);
        res.send('Something went wrong');

    });
            
};