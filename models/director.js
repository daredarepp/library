var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var directorSchema = new Schema({first_name: {type: String, required: true, max:100},
                                last_name: {type: String, required: true, max:100},
                                date_of_birth: {type: Date},
                                date_of_death: {type: Date},
                                bio: {type: String, default: 'No biography available for this director.'} 

})

// Virtual for director's url
directorSchema
.virtual('url')
.get(function(){
    return '/catalog/directors/' + this._id;
})

// Virtual for director's full name
directorSchema
.virtual('name')
.get(function(){
    return this.first_name + ' ' + this.last_name;
})

module.exports = mongoose.model('Director', directorSchema);