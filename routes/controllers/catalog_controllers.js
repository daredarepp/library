var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');
var Genre = require('/Users/Darko/Desktop/Library/library/models/genre');

/* GET catalog page. */

module.exports.catalog_get = function(req,res,next){
    res.render('catalog',{title: "Catalog"});
};

/* GET category */

module.exports.catalog_category_get = function(req, res, next){

    
    var category = req.params.category;
    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    
    mongoose.connect(uri, options);


    switch(category){
        
        // Books
        case 'books':
            Book.find(function(err, result){
                if(err) throw err;
                res.json(result);
                mongoose.disconnect();
            });
            break;

        // Authors
        case 'authors':
            Author.find(function(err, result){
                if(err) throw err;
                res.json(result);
                mongoose.disconnect();
            });
            break;

        // Genres
        case 'genres':
            Genre.find(function(err, result){
                if(err) throw err;
                res.json(result);
                mongoose.disconnect();
            });
            break;

        default:
            mongoose.disconnect();
            res.send('There is no such category');

    }
    
    
};
