var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');
var Genre = require('/Users/Darko/Desktop/Library/library/models/genre');

/* GET catalog page. */

module.exports.catalog_get = function(req,res,next){
    res.render('catalog', {title: "Catalog"});
};

/* GET category */

module.exports.catalog_category_get = function(req, res, next){

    
    var category = req.params.category;
    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    
    mongoose.connect(uri, options);
    
    // AJAX request
    if(req.xhr){
          
        switch(category){
            
            // Books
            case 'books':

                Book.find({}, 'title author -_id').populate('author', 'first_name family_name -_id').exec(function(err, result){
                    if(err) throw err;
                    res.json(result);
                });
                break;

            // Authors
            case 'authors':

                Author.find({}, 'first_name family_name -_id').exec(function(err, result){
                    if(err) throw err;
                    res.json(result);
                });
                break;

            // Genres
            case 'genres':

                Genre.find({}, 'name -_id').exec(function(err, result){
                    if(err) throw err;
                    res.json(result);
                });
                break;

            default:

                res.send('There is no such category');

        }
    
    // Regular request
    }else{
        
        switch(category){

             // Books
            case 'books':

                Book.find({}, 'title author -_id').populate('author', 'first_name family_name -_id').exec(function(err, result){
                    if(err) throw err;
                    console.log(result);
                    res.render('catalog', {title: 'Catalog', category: 'Books', result: result});
                });
                break;

            // Authors
            case 'authors':

                Author.find({}, 'first_name family_name -_id').exec(function(err, result){
                    if(err) throw err;
                    res.render('catalog', {title: 'Catalog', category: 'Authors', result: result});
                });
                break;

            // Genres
            case 'genres':

                Genre.find({}, 'name -_id').exec(function(err, result){
                    if(err) throw err;
                    res.render('catalog', {title: 'Catalog', category: 'Genres', result: result});
                });
                break;

            default:

                res.send('There is no such category');
        };
    };
    
};
