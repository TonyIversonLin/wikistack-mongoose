var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

//setting up data model schema
const Schema = mongoose.Schema;

const pageSchema = new Schema({
	title: {type: String, require: true},
	urlTitle: {type: String, require: true},
	content: {type: String, require: true},
	status: {type: String, enum: ['open', 'closed']}
	date: {type:Date, default: Date.now}
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

pageSchema.virtual('urlTitle.route').get(function(){
	return '/wiki/'+this.urlTitle;
})

const userSchema =  new Schema({
	name: {type: String, require: true},
	email: {type: String, require: true, unique: true}
});

const Page = mongoose.model('Page', pageSchema);
const User = mongoose.model('User', userSchema);

module.export = {
	Page,
	User
}