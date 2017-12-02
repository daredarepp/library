var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/movie');
var Director = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/director');
var Genre = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/genre');

/* GET catalog index page. */

module.exports.catalog_get = function(req,res,next) {

    res.render('catalog');

};

/* GET category */

module.exports.catalog_category_get = function(req, res, next) {
    
    var uri = 'mongodb://localhost/moviedb';
    var options = { useMongoClient: true };
    var category = req.params.category;

    mongoose.connect(uri, options);
    
    switch(category) {
        
        // Movies
        case 'movies':
            
            Movie.find({}, 'title year').sort('title').exec(function(err, movies) {

                if (err) throw err;
                
                // AJAX
                if (req.xhr) {

                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Movies', 
                    icon: 'local_movies', result: movies});
                    
                // Regular
                }else{

                    res.render('catalog', {category: 'Movies', icon: 'local_movies', result: movies});
                    
                };

            });
            break;

        // Directors
        case 'directors':
            
            Director.find({}, 'first_name last_name').sort('first_name').exec(function(err, directors) {
                
                if (err) throw err;
                
                // AJAX
                if (req.xhr) {

                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Directors',
                    icon: 'people', result: directors});
                    
                // Regular
                } else {

                    res.render('catalog', {category: 'Directors', icon: 'people', result: directors});
                    
                }

            });
            break;

        // Genres
        case 'genres':
            
            Genre.find({}, 'name').sort('name').exec(function(err, genres) {

                if (err) throw err;
                
                // AJAX
                if (req.xhr) {
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Genres', 
                    icon: 'view_agenda', result: genres});
                
                // Regular
                } else {

                    res.render('catalog', {category: 'Genres', icon: 'view_agenda', result: genres});

                }

            });

    }

};

/* GET single item */

module.exports.catalog_item_get = function(req, res, next) {
    
    var uri = 'mongodb://localhost/moviedb';
    var options = { useMongoClient: true };
    var category = req.params.category;
    var id = req.params.id;

    mongoose.connect(uri, options);

    switch(category) {

        // Single movie 
        case 'movies':

            Movie.findOne({'_id': id}).populate('director', 'first_name last_name').populate('genre').exec(function(err, movie) {

                if (err) throw err;
                
                // AJAX
                if (req.xhr) {
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Movies', 
                    icon: 'local_movies', movie: movie, single: true, ajax: req.xhr});

                // Regular
                } else {

                    res.render('catalog', {category: 'Movies', icon: 'local_movies', movie: movie, single: true, ajax: req.xhr});

                }

            });
            break;

        // Single director
        case 'directors':

            var directorPromise = Director.findOne({'_id': id}).exec();
            var directorMoviesPromise = Movie.find({'director': id}, 'title year').exec();           

            Promise.all([directorPromise, directorMoviesPromise]).then(function([director, director_movies]) {

                 // AJAX
                 if (req.xhr) {
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Directors', 
                    icon: 'people', director: director, director_movies: director_movies, single: true, ajax: req.xhr});

                // Regular
                } else {

                    res.render('catalog', {category: 'Directors', icon: 'people', director: director, director_movies: director_movies, single: true, ajax: req.xhr});

                }

            }).catch(function(err) {

                console.log(err);
                res.send('Something went wrong');

            });
            break;
        
        // Single Genre
        case 'genres':

            var genrePromise = Genre.findOne({'_id': id}).exec();
            var genreMoviesPromise = Movie.find({'genre': id}, 'title year').exec();

            Promise.all([genrePromise, genreMoviesPromise]).then(function([genre, genre_movies]) {

                // AJAX
                if (req.xhr) {
                    
                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Genres', 
                    icon: 'view_agenda', genre: genre, genre_movies: genre_movies, single: true, ajax: req.xhr});

                // Regular
                } else {

                    res.render('catalog', {category: 'Genres', icon: 'view_agenda', genre: genre, genre_movies: genre_movies, single: true, ajax: req.xhr});

                }

            }).catch(function(err) { 
                
                console.log(err);
                res.send('Something went wrong');

            });
            
    }

};