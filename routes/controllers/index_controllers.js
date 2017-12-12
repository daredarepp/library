var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('../../models/movie');
var Director = require('../../models/director');

/* GET home page. */

module.exports.index_get = function(req, res, next) {

    var uri = 'mongodb://localhost/moviedb';
    var options = { useMongoClient: true };

    mongoose.connect(uri, options);
    var db = mongoose.connection;
    db.once('error', console.error.bind(console, 'MongoDB connection error:'));
    
    var moviesPromise = Movie.find({}, 'title year').limit(8).sort('-year').exec();
    var directorsPromise = Director.aggregate([
        
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
                numberOfMovies: -1,
                first_name: 1
            }
        },
        {$limit: 8}
    ])
    .exec();
    
    Promise.all([moviesPromise, directorsPromise])
        .then(function([movies, directors]){

            directors.forEach(function(director){

                director.url= "/catalog/directors/" + director._id;
                director.name = director.first_name + ' ' + director.last_name;
                director.numberOfMovies > 1 ? director.numberOfMovies += ' movies' : director.numberOfMovies += ' movie'

            })
        
            res.render('home', {movies: movies, directors: directors});

        }).catch(function(err){

            console.log(err);
            res.send('Something went wrong');

        });

};