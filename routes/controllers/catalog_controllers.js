var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');
var Genre = require('/Users/Darko/Desktop/Library/library/models/genre');

/* GET catalog index page. */

module.exports.catalog_get = function(req,res,next){
    res.render('catalog', {title: "Catalog"});
};

/* GET category */

module.exports.catalog_category_get = function(req, res, next){
    
    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    var category = req.params.category;

    mongoose.connect(uri, options);
    
    switch(category){
        
        // Books
        case 'books':

            Book.find({}, 'title author').sort('title').populate('author', 'first_name family_name').exec(function(err, books){

                if(err) throw err;

                // AJAX
                if(req.xhr){

                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Books', 
                    icon: 'library_books', result: books});
                    
                // Regular
                }else{

                    res.render('catalog', {title: 'Catalog', category: 'Books', icon: 'library_books',
                    result: books});

                };

            });
            break;

        // Authors
        case 'authors':

            Author.find({}, 'first_name family_name').sort('family_name').exec(function(err, authors){

                if(err) throw err;

                // AJAX
                if(req.xhr){

                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Authors',
                    icon: 'people', result: authors});
                
                // Regular
                }else{

                    res.render('catalog', {title: 'Catalog', category: 'Authors', icon: 'people', result: authors});

                };

            });
            break;

        // Genres
        case 'genres':

            Genre.find({}, 'name').sort('name').exec(function(err, genres){

                if(err) throw err;

                // AJAX
                if(req.xhr){
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Genres', 
                    icon: 'view_agenda', result: genres});
                
                // Regular
                }else{

                    res.render('catalog', {title: 'Catalog', category: 'Genres', icon: 'view_agenda', result: genres});

                };

            });

    };

};

/* GET single item */

module.exports.catalog_item_get = function(req, res, next){
    
    var uri = 'mongodb://localhost/mydb';
    var options = { useMongoClient: true };
    var category = req.params.category;
    var id = req.params.id;

    mongoose.connect(uri, options);

    switch(category){

        // Single Book 
        case 'books':

            Book.findOne({'_id': id}).populate('author', 'first_name family_name').populate('genre').exec(function(err, book){

                if(err) throw err;
                
                // AJAX
                if(req.xhr){
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Books', 
                    icon: 'library_books', book: book, single: true, ajax: req.xhr});

                // Regular
                }else{

                    res.render('catalog', {title: 'Catalog', category: 'Books', icon: 'library_books', book: book, single: true, ajax: req.xhr});

                };

            });
            break;

        // Single Author
        case 'authors':

            Author.findOne({'_id': id}).exec(function(err, author){

                if(err) throw err;

                // Author's books
                Book.find({'author': id}, 'title').exec(function(err, author_books){

                    if(err) throw err;

                    // AJAX
                    if(req.xhr){
    
                        res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Authors', 
                        icon: 'people', author: author, author_books: author_books, single: true, ajax: req.xhr});
    
                    // Regular
                    }else{
    
                        res.render('catalog', {title: 'Catalog', category: 'Authors', icon: 'people', author: author, author_books: author_books, single: true, ajax: req.xhr});
    
                    };

                });

            });
            break;
        
        // Single Genre
        case 'genres':

            Genre.findOne({'_id': id}).exec(function(err, genre){

                if(err) throw err;
                
                // Genre's books
                Book.find({'genre': id}, 'title').exec(function(err, genre_books){

                    if(err) throw err;

                    // AJAX
                    if(req.xhr){
    
                        res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Genres', 
                        icon: 'view_agenda', genre: genre, genre_books: genre_books, single: true, ajax: req.xhr});

                    // Regular
                    }else{
    
                        res.render('catalog', {title: 'Catalog', category: 'Genres', icon: 'view_agenda', genre: genre, genre_books: genre_books, single: true, ajax: req.xhr});
    
                    };

                });

            });
            
    };

};