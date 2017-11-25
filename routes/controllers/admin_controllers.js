var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Book = require('/Users/Darko/Desktop/Library/library/models/book');
var Author = require('/Users/Darko/Desktop/Library/library/models/author');
var Genre = require('/Users/Darko/Desktop/Library/library/models/genre');

/* GET admin page. */

module.exports.admin_get = function(req,res,next){

    var uri = 'mongodb://localhost/mydb';
    var options = {useMongoClient: true};

    mongoose.connect(uri, options);

    var booksPromise = Book.find({}, 'title').sort('title').exec();
    var authorsPromise = Author.find({}, 'first_name family_name').sort('family_name').exec();
    var genresPromise = Genre.find({}, 'name').sort('name').exec();

    Promise.all([booksPromise, authorsPromise, genresPromise]).then(function([books, authors, genres]) {

        res.render('admin', {title: "Admin", books: books, authors: authors, genres: genres});

    }).catch(function(err){

        console.log(err);
        res.send('Something went wrong');

    });

};