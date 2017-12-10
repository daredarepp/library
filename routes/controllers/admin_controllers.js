var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('../../models/movie');
var Director = require('../../models/director');
var Genre = require('../../models/genre');

/* GET admin page. */

module.exports.admin_get = function(req,res,next) {

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

/* Delete items from database */

module.exports.delete_items = function(req, res, next) {

    var category = req.params.category;
    var id = req.params.id;

    var uri = 'mongodb://localhost/moviedb';
    var options = {useMongoClient: true};

    mongoose.connect(uri, options);

    switch(category) {

        case "movies":

            Movie.find({'_id': id}).remove().exec()
            
                .then(function(result) {

                    console.log(result);
                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                break;

        case "directors":
                
            Director.find({'_id': id}).remove().exec()
                .then(function(result) {

                    console.log(result);
                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                break;

        case "genres":
                
            Genre.find({'_id': id}).remove().exec()
                .then(function(result) {

                    console.log('mongoose result: ' + result);
                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                break;
    }

}