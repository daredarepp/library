var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('../../models/movie');
var Director = require('../../models/director');
var Genre = require('../../models/genre');

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
                    icon: 'local_movies', result: movies, ajax: req.xhr});
                    
                // Regular
                }else{

                    res.render('catalog', {category: 'Movies', icon: 'local_movies', result: movies, ajax: req.xhr});
                    
                };

            });
            break;

        // Directors
        case 'directors':
            
            Director.aggregate([
                
                {$lookup: 
                    {
                        from: 'movies',
                        localField: '_id',
                        foreignField: 'director',
                        as: 'movies'
                    }
                },
                {$project:
                    {
                        first_name: 1,
                        last_name: 1,
                        numberOfMovies: {$size: "$movies"}
                    }
                },
                {$sort: 
                    {
                        first_name: 1
                    }
                }
            ])
            .exec(function(err, directors) {
                
                if (err) throw err;
                
                directors.forEach(function(director){
                    
                    director.url= "/catalog/directors/" + director._id;
                    director.name = director.first_name + ' ' + director.last_name;
                    director.numberOfMovies > 1 ? director.numberOfMovies += ' movies' : director.numberOfMovies += ' movie'
        
                })

                // AJAX
                if (req.xhr) {

                    res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Directors',
                    icon: 'people', result: directors, ajax: req.xhr});
                    
                // Regular
                } else {

                    res.render('catalog', {category: 'Directors', icon: 'people', result: directors, ajax: req.xhr});
                    
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
                    icon: 'view_agenda', result: genres, ajax: req.xhr});
                
                // Regular
                } else {

                    res.render('catalog', {category: 'Genres', icon: 'view_agenda', result: genres, ajax: req.xhr});

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

            var moviePromise = Movie.findOne({'_id': id}).populate('genre').exec();
            var movieDirectorsPromise = function(movie){

                    return Director.aggregate([
                        {$match: 
                            {
                                _id: {$in: movie.director}
                            }
                        },
                        {$lookup: 
                            {
                                from: 'movies',
                                localField: '_id',
                                foreignField: 'director',
                                as: 'movies'
                            }
                        },
                        {$project:
                            {
                                first_name: 1,
                                last_name: 1,
                                numberOfMovies: {$size: "$movies"}
                            }
                        },
                        {$sort: 
                            {
                                first_name: 1
                            }
                        }
                    ])
                    .exec();

            };

            moviePromise
                .then(function(movie){
                    
                    return Promise.all([movie, movieDirectorsPromise(movie)])
                    
                })
                .then(function([movie, movieDirectors]){

                    movieDirectors.forEach(function(director){
                        
                        director.url= "/catalog/directors/" + director._id;
                        director.name = director.first_name + ' ' + director.last_name;
                        director.numberOfMovies > 1 ? director.numberOfMovies += ' movies' : director.numberOfMovies += ' movie'
            
                    })

                    // AJAX
                    if (req.xhr) {
                        
                        res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Movies', 
                        icon: 'local_movies', movie: movie, movieDirectors: movieDirectors, single: true, ajax: req.xhr});

                    // Regular
                    } else {

                        res.render('catalog', {category: 'Movies', icon: 'local_movies', movie: movie, movieDirectors: movieDirectors, single: true, ajax: req.xhr});

                    }

                })
                .catch(function(err){
                    
                    console.log(err);
                    res.send("Something went wrong");

                })
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

            Promise.all([genrePromise, genreMoviesPromise])
                .then(function([genre, genre_movies]) {

                    // AJAX
                    if (req.xhr) {
                        
                        res.render('presets/catalog_presets/catalog_ajax/category_ajax', {category: 'Genres', 
                        icon: 'view_agenda', genre: genre, genre_movies: genre_movies, single: true, ajax: req.xhr});

                    // Regular
                    } else {

                        res.render('catalog', {category: 'Genres', icon: 'view_agenda', genre: genre, genre_movies: genre_movies, single: true, ajax: req.xhr});

                    }

                }) 
                .catch(function(err) { 
                    
                    console.log(err);
                    res.send('Something went wrong');

                });
            
    }

};