var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var genreSchema = new Schema({name: {type: String, required: true, min: 3, max: 100}})

// Virtual for genre's URL

genreSchema
.virtual('url')
.get(function(){

    return "/catalog/genres/" + this._id;
})

module.exports = mongoose.model('Genre', genreSchema);