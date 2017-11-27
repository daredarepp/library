var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('/Users/Darko/Desktop/Library/library/models/movie');
var Director = require('/Users/Darko/Desktop/Library/library/models/director');

/* GET home page. */

module.exports.index_get = function(req, res, next) {

    var uri = 'mongodb://localhost/moviedb';
    var options = { useMongoClient: true };

    mongoose.connect(uri, options);
    
    var moviesPromise = Movie.find({}, 'title year').limit(8).sort('-year').exec();
    var directorsPromise = Director.find({}, 'first_name last_name').limit(8).sort('first_name').exec();
    
    Promise.all([moviesPromise, directorsPromise]).then(function([movies, directors]){

        res.render('home', {movies: movies, directors: directors});

    }).catch(function(err){

        console.log(err);
        res.send('Something went wrong');

    });
            
};