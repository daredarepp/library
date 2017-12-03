var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/movie');
var Director = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/director');
var Genre = require('/Users/Darko/Desktop/MovieDb/MovieDb/models/genre');

/* GET admin page. */

module.exports.admin_get = function(req,res,next){

    var uri = 'mongodb://localhost/moviedb';
    var options = {useMongoClient: true};

    mongoose.connect(uri, options);

    var moviesPromise = Movie.find({}, 'title').sort('title').exec();
    var directorsPromise = Director.find({}, 'first_name last_name').sort('first_name').exec();
    var genresPromise = Genre.find({}, 'name').sort('name').exec();

    Promise.all([moviesPromise, directorsPromise, genresPromise])
        .then(function([movies, directors, genres]) {

            res.render('admin', {movies: movies, directors: directors, genres: genres});

        }).catch(function(err){

            console.log(err);
            res.send('Something went wrong');

        });

};