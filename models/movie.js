var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({title: {type: String, required: true},
                             director: {type: Schema.Types.ObjectId, ref: "Director", required: true},
                             storyline: {type: String, required: true},
                             genre: [{type: Schema.Types.ObjectId, ref: "Genre"}]
})

// Virtual for movie's url
movieSchema
.virtual('url')
.get(function(){
    return "/catalog/movies/" + this._id;
})

module.exports = mongoose.model('Movie', movieSchema);