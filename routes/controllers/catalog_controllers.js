var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');
var Genre = require('/Users/Darko/Desktop/Library/library/models/genre');

/* GET catalog page. */

module.exports.catalog_get = function(req,res,next){
    res.render('catalog',{title: "Catalog"});
};

/* GET Books */

module.exports.catalog_books_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    
    mongoose.connect(uri, options);
    Book.find(function(err, result){
        if(err) throw err;
        res.json(result);
    });
};

/* GET Authors */

module.exports.catalog_authors_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    
    mongoose.connect(uri, options);
    Author.find(function(err, result){
        if(err) throw err;
        res.json(result);
    });
    
};

/* GET Genres */

module.exports.catalog_genres_get = function(req, res, next){

    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    
    mongoose.connect(uri, options);
    Genre.find(function(err, result){
        if(err) throw err;
        res.json(result);
    });

};