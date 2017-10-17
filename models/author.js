var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema({first_name: {type: String, required: true, max:100},
                               family_name: {type: String, required: true, max:100},
                               date_of_birth: {type: Date, default: Date.now},
                               date_of_death: {type: Date, default: Date.now}
})

// Virtual for author's full name

authorSchema
.virtual('name')
.get(function(){

    return this.family_name + ', ' + this.first_name;
})

// Virtual for author's URL

authorSchema
.virtual('url')
.get(function(){

    return '/catalog/author/' + this._id;
})

module.exports = mongoose.model('Author', authorSchema);