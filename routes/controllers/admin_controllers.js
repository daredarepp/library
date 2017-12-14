var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Movie = require('../../models/movie');
var Director = require('../../models/director');
var Genre = require('../../models/genre');

/* GET admin page */

module.exports.admin_get = function(req,res,next) {

    var uri = 'mongodb://localhost/moviedb';
    var options = {useMongoClient: true};

    mongoose.connect(uri, options);
    var db = mongoose.connection;
    db.once('error', console.error.bind(console, 'MongoDB connection error:'));

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
    var db = mongoose.connection;
    db.once('error', console.error.bind(console, 'MongoDB connection error:'));

    switch(category) {

        case "movies":

            Movie.find({'_id': id}).remove().exec()
            
                .then(function() {

                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                break;

        case "directors":
                
            Director.find({'_id': id}).remove().exec()
                .then(function() {

                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                break;

        case "genres":
                
            Genre.find({'_id': id}).remove().exec()
                .then(function() {

                    res.send('Successfully deleted');

                })
                .catch(function(err) {

                    console.log(err);
                    res.send('Something went wrong');

                })
                
    }

}

/* Populate database */
module.exports.populate_database = function(req, res, next) {

    var uri = 'mongodb://localhost/moviedb';
    var options = {useMongoClient: true};

    mongoose.connect(uri, options);

    // Genres
    var allGenres = function() {
        var gen1 = {
            name: 'Drama'
        };
        var gen2 = {
            name: 'Sci-Fi'
        };
        var gen3 = {
            name: 'Sport'
        };
        var gen4 = {
            name: 'Thriller'
        };
        var gen5 = {
            name: 'Adventure'
        };
        var gen6 = {
            name: 'Action'
        };
        var gen7 = {
            name: 'Mystery'
        };
        var gen8 = {
            name: 'Biography'
        };
        var gen9 = {
            name: 'Crime'
        };
        var gen10 = {
            name: 'War'
        };
        var gen11 = {
            name: 'Fantasy'
        };
        var allGenres = [gen1, gen2, gen3, gen4, gen5, gen6, gen7, gen8, gen9, gen10, gen11];
    
        var insertGenres = Genre.insertMany(allGenres);

        return insertGenres

    }

    // Directors
    var allDirectors = function() {
        
        var dir1 = {
            first_name: "Zack",
            last_name: "Snyder",
            date_of_birth: new Date(1996, 02 ,01),
            bio: "Zachary Edward 'Zack' Snyder (born March 1, 1966) is an American film director, film producer, and screenwriter, best known for action and science fiction films. Snyder made his feature film debut with the 2004 remake Dawn of the Dead and has gone on to be known for his comic book movies and superhero films."
        };
        var dir2 = {
            first_name: "Christopher",
            last_name: "Nolan",
            date_of_birth: new Date(1970, 06, 30),
            bio: "Best known for his cerebral, often nonlinear storytelling, acclaimed writer-director Christopher Nolan was born on July 30, 1970 in London, England."
        };
        var dir3 = {
            first_name: "Denis",
            last_name: "Villeneuve",
            date_of_birth: new Date(1967, 09, 03),
            bio: "Denis Villeneuve is a French Canadian film director and writer. He was born in 1967, in Trois-Rivières, Québec, Canada. He started is career as a filmmaker at the National Film Board of Canada."
        };
        var dir4 = {
            first_name: "Gavin",
            last_name: "O'Connor",
            date_of_birth: new Date(1963, 11, 24),
            bio: "Gavin O'Connor was born in 1963 in Long Island, New York, USA as Gavin James O'Connor. He is a director and producer, known for Pride and Glory, Warrior and Tumbleweeds."
        };
        var dir5 = {
            first_name: "James",
            last_name: "Cameron",
            date_of_birth: new Date(1954, 07, 16),
            bio: "James Francis Cameron was born on August 16, 1954 in Kapuskasing, Ontario, Canada. He moved to the United States in 1971. The son of an engineer, he majored in physics at California State University"
        };
        var dir6 = {
            first_name: "Joe",
            last_name: "Carnahan",
            date_of_birth: new Date(1969, 04, 09),
            bio: "Joe Carnahan was born in 1969 in Sacramento, California, USA as Joseph Aaron Carnahan. He is a producer and writer, known for The A-Team, Narc and Smokin'Aces."
        };
        var dir7 = {
            first_name: "Lana",
            last_name: "Wachowski",
            date_of_birth: new Date(1965, 05, 21),
            bio: "Lana Wachowski and her sister Lilly Wachowski, (also known as 'The Wachowskis') are the duo behind ground-breaking movies such as The Matrix and Cloud Atlas."
        };
        var dir8 = {
            first_name: "Lilly",
            last_name: "Wachowski",
            date_of_birth: new Date(1967, 12, 29),
            bio: "Director, writer and producer Lilly Wachowski was born in 1967 in Chicago as Andrew Wachowski, the son of Lynne, a nurse and painter and Ron, a businessman. Lilly was educated at Kellogg Elementary School in Chicago, before moving on to Whitney Young High School."
        };
        var dir9 = {
            first_name: "Michael",
            last_name: "Mann",
            date_of_birth: new Date(1943, 02, 05),
            bio: "A student of London's International Film School, Michael Mann began his career in the late 70s, writing for TV shows like Starsky and Hutch. He directed his first film, the award-winning prison drama The Jericho Mile, in 1979."
        };
        var dir10 = {
            first_name: "Quentin",
            last_name: "Tarantino",
            date_of_birth: new Date(1963, 03, 27),
            bio: "Quentin Jerome Tarantino was born in Knoxville, Tennessee. His father, Tony Tarantino, is an Italian-American actor and musician from New York, and his mother, Connie (McHugh), is a nurse from Tennessee."
        };
        var dir11 = {
            first_name: "Richard",
            last_name: "Schenkman",
            date_of_birth: new Date(1958, 02, 06),
            bio: "Richard Schenkman writes, directs and produces feature films, among other things. His first film was The Pompatus of Love, which he wrote with Jon Cryer and Adam Oliensis. A festival favorite, it enjoyed a successful theatrical release in 1995."
        };
        var dir12 = {
            first_name: "Robert",
            last_name: "Zemeckis",
            date_of_birth: new Date(1952, 04, 14),
            bio: "A whiz-kid with special effects, Robert is from the Spielberg camp of film-making (Steven Spielberg produced many of his films). Usually working with writing partner Bob Gale, Robert's earlier films show he has a talent for zany comedy."
        };
        var dir13 = {
            first_name: "David",
            last_name: "Fincher",
            date_of_birth: new Date(1962, 08, 28),
            bio: "David Fincher was born in 1962 in Denver, Colorado, and was raised in Marin County, California. When he was 18 years old he went to work for John Korty at Korty Films in Mill Valley."
        };
        var allDirectors = [dir1, dir2, dir3, dir4, dir5, dir6, dir7, dir8, dir9, dir10, dir11, dir12, dir13];

        var insertDirectors = Director.insertMany(allDirectors);

        return insertDirectors
        
    }
        
    // Movies
    var mov1 = function() {
        
        var title = "The Matrix";

        var year = new Date(1999, 01, 01);

        var storyline = "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.";

        var directors = Director.find({
            $or: [{
                    first_name: "Lilly",
                    last_name: "Wachowski"
                },
                {
                    first_name: "Lana",
                    last_name: "Wachowski"
                }
            ]
        }).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Sci-Fi"
            }]
        }).select('_id').exec();

        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov2 = function() {

        var title = "Avatar";
        
        var year = new Date(2009, 01, 01);
    
        var storyline = "A paraplegic marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.";
    
        var directors = Director.find({first_name: "James", last_name: "Cameron"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Adventure"
            }, {
                name: "Fantasy"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov3 = function() {

        var title = "Contact";
        
        var year = new Date(1997, 01, 01);
    
        var storyline = "Dr. Ellie Arroway, after years of searching, finds conclusive radio proof of extraterrestrial intelligence, sending plans for a mysterious machine.";
    
        var directors = Director.find({first_name: "Robert", last_name: "Zemeckis"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Drama"
            }, {
                name: "Mystery"
            }, {
                name: "Sci-Fi"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov4 = function() {

        var title = "Fight Club";
        
        var year = new Date(1999, 01, 01);
    
        var storyline = "An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soap maker, forming an underground fight club that evolves into something much, much more.";
    
        var directors = Director.find({first_name: "David", last_name: "Fincher"}).select('_id').exec();
        
        var genres = Genre.find({
            name: "Drama"
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov5 = function() {

        var title = "Inception";
        
        var year = new Date(2010, 01, 01);
    
        var storyline = "A thief, who steals corporate secrets through use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a CEO.";
    
        var directors = Director.find({first_name: "Christopher", last_name: "Nolan"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Adventure"
            }, {
                name: "Sci-Fi"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov6 = function() {

        var title = "The Dark Knight";
        
        var year = new Date(2008, 01, 01);
    
        var storyline = "When the menace known as the Joker emerges from his mysterious past, he wreaks havoc and chaos on the people of Gotham, the Dark Knight must accept one of the greatest psychological and physical tests of his ability to fight injustice.";
    
        var directors = Director.find({first_name: "Christopher", last_name: "Nolan"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Crime"
            }, {
                name: "Drama"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov7 = function() {

        var title = "Inglorious Basterds";
        
        var year = new Date(2009, 01, 01);
    
        var storyline = "In Nazi-occupied France during World War II, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner's vengeful plans for the same.";
    
        var directors = Director.find({first_name: "Quentin", last_name: "Tarantino"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Adventure"
            }, {
                name: "Drama"
            }, {
                name: "War"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov8 = function() {

        var title = "Prisoners";
        
        var year = new Date(2013, 01, 01);
    
        var storyline = "When Keller Dover's daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads and the pressure mounts.";
    
        var directors = Director.find({first_name: "Denis", last_name: "Villeneuve"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Crime"
            }, {
                name: "Drama"
            }, {
                name: "War"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov9 = function() {

        var title = "Public Enemies";
        
        var year = new Date(2009, 01, 01);
    
        var storyline = "The Feds try to take down notorious American gangsters John Dillinger, Baby Face Nelson and Pretty Boy Floyd during a booming crime wave in the 1930s.";
    
        var directors = Director.find({first_name: "Michael", last_name: "Mann"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Biography"
            }, {
                name: "Crime"
            }, {
                name: "Drama"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov10 = function() {

        var title = "Terminator 2";
        
        var year = new Date(1991, 01, 01);
    
        var storyline = "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son, John Connor, from a more advanced cyborg.";
    
        var directors = Director.find({first_name: "James", last_name: "Cameron"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Sci-Fi"
            }, {
                name: "Thriller"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov11 = function() {

        var title = "The Grey";
        
        var year = new Date(2011, 01, 01);
    
        var storyline = "After their plane crashes in Alaska, six oil workers are led by a skilled huntsman to survival, but a pack of merciless wolves haunts their every step.";
    
        var directors = Director.find({first_name: "Joe", last_name: "Carnahan"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Adventure"
            }, {
                name: "Drama"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov12 = function() {

        var title = "The Man From Earth";
        
        var year = new Date(2007, 01, 01);
    
        var storyline = "An impromptu goodbye party for Professor John Oldman becomes a mysterious interrogation after the retiring scholar reveals to his colleagues he has a longer and stranger past than they can imagine.";
    
        var directors = Director.find({first_name: "Richard", last_name: "Schenkman"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Drama"
            }, {
                name: "Fantasy"
            }, {
                name: "Sci-Fi"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov13 = function() {

        var title = "Warrior";
        
        var year = new Date(2011, 01, 01);
    
        var storyline = "The youngest son of an alcoholic former boxer returns home, where he's trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.";
    
        var directors = Director.find({first_name: "Gavin", last_name: "O'Connor"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Drama"
            }, {
                name: "Sport"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov14 = function() {

        var title = "Watchmen";
        
        var year = new Date(2009, 01, 01);
    
        var storyline = "In 1985 where former superheroes exist, the murder of a colleague sends active vigilante Rorschach into his own sprawling investigation, uncovering something that could completely change the course of history as we know it.";
    
        var directors = Director.find({first_name: "Zack", last_name: "Snyder"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Action"
            }, {
                name: "Drama"
            }, {
                name: "Mystery"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var mov15 = function() {

        var title = "Interstellar";
        
        var year = new Date(2014, 01, 01);
    
        var storyline = "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.";
    
        var directors = Director.find({first_name: "Christopher", last_name: "Nolan"}).select('_id').exec();
        
        var genres = Genre.find({
            $or: [{
                name: "Adventure"
            }, {
                name: "Drama"
            }, {
                name: "Sci-Fi"
            }]
        }).select('_id').exec();
    
        return Promise.all([title, year, storyline, directors, genres])

    }

    var processMovie = function([title, year, storyline, directors, genres]) {

        // process the genres
        var genresFixed = genres.map(function(genre) {
                
            return genre._id

        })

        // process the directors
        var directorsFixed = directors.map(function(director) {

            return director._id

        })
        
        // Return promise with the new movie
        var newMovie = new Movie({
            title: title,
            year: year,
            storyline: storyline,
            director: directorsFixed,
            genre: genresFixed
        }) 

        return newMovie.save()

    }

    // Start the chain
    // Empty the genres collection
    Genre.find().remove()
    .then(function(outcome) {

        console.log(outcome.result.n + " genres removed, genres collection empty");

        return allGenres()

    })
    // Insert the genres
    .then(function(genres){

        console.log("Successfully inserted " + genres.length + " new genres");

        return Director.find().remove()

    })
    // Empty the directors collection
    .then(function(outcome) {

        console.log(outcome.result.n + " directors removed, directors collection empty");

        return allDirectors();

    })
    // Insert the directors
    .then(function(directors){

        console.log("Successfully inserted " + directors.length + " new directors");

        return Movie.find().remove()

    })
    // Empty the movies collection
    .then(function(outcome) {

        console.log(outcome.result.n + " movies removed, movies collection empty");

        return mov1()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 1st movie
    .then(function() {

        console.log('Saved the 1st movie');

        return mov2()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 2nd movie
    .then(function() {

        console.log("Saved the 2nd movie");

        return mov3()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 3rd movie
    .then(function() {

        console.log('Save the 3rd movie');

        return mov4();

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 4th movie
    .then(function() {

        console.log("Saved the 4th movie");

        return mov5()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 5th movie
    .then(function() {

        console.log('Save the 5th movie');

        return mov6()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 6th movie
    .then(function() {

        console.log('Saved the 6th movie');

        return mov7()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 7th movie
    .then(function() {

        console.log('Saved the 7th movie');
        
        return mov8()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 8th movie
    .then(function() {

        console.log('Saved the 8th movie');

        return mov9()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 9th movie
    .then(function() {

        console.log('Saved the 9th movie');

        return mov10()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 10th movie
    .then(function() {

        console.log("Saved the 10th movie");

        return mov11()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 11th movie
    .then(function() {

        console.log('Saved the 11th movie');

        return mov12()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 12th movie
    .then(function() {

        console.log('Saved the 12th movie');
        
        return mov13()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 13th movie
    .then(function() {

        console.log('Saved the 13th movie');

        return mov14()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 14th movie
    .then(function() {

        console.log('Saved the 14th movie');

        return mov15()

    })
    .then(function(movieDetails) {
        
        return processMovie(movieDetails)

    })
    // Save the 15th movie
    .then(function() {

        console.log('Saved the 15th movie.');
        console.log('Successfully populated the database.');

        res.render('admin', {reset: true});

    })
    .catch(function(err) {

        console.log(err);
        
        res.send('Something went wrong');

    })


}