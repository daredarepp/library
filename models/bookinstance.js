var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookInstanceSchema = new Schema({book: {type: Schema.Types.ObjectId, ref: "Book", required: true},
                                     imprint: {type: String, required: true},
                                     status: {type: String, required: true, enum: ['Available','Maintenance','Reserved','Loaned'], default: 'Maintenance'},
                                     due_back: {type: Date, default: Date.now}
})

// Virtual for bookinstance's URL

bookInstanceSchema
.virtual('url')
.get(function(){

    return "/catalog/bookinstances/" + this._id;
})

module.exports = mongoose.model('BookInstance', bookInstanceSchema);