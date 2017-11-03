var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
	name: String,
	lastname: String,
    phone: String,
    email: String,
    avatar: String,
    hobbies: Array
});

module.exports = mongoose.model('Contact', contactSchema); 