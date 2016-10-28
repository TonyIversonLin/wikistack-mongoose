const mongoose = require('mongoose');
const marked = require('marked');
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
	status: {type: String, enum: ['open', 'closed']},
	date: {type:Date, default: Date.now},
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	tags: [String]
},{
	toObject: {virtuals: true},
	toJSON: {virtuals: true}
});

pageSchema.virtual('route').get(function(){
	return "/wiki/"+this.urlTitle;
});

pageSchema.virtual('renderedContent').get(function() {
	return marked(this.content);
})

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

pageSchema.pre('validate',function(next) {
	let urlTitle = generateUrlTitle(this.title);
	this.urlTitle = urlTitle;
	next();
});

pageSchema.statics.findByTag = function(tags) {
	return this.find({ tags: {$in: tags} }).exec();
}

pageSchema.methods.findSimilar =  function() {
	return Page.find({ tags: {$in: this.tags}}).exec();
}

const userSchema =  new Schema({
	name: {type: String, require: true},
	email: {type: String, require: true, unique: true}
});

userSchema.statics.findOrCreate = function (person) {
	return this.findOne({email: person.email}).exec()
		.then(function(user) {
			if(user) return user;
			else {
				let newUser = new User({name: person.name, email: person.email});
				return newUser.save();
			}
		});
}

const Page = mongoose.model('Page', pageSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
	Page: Page,
	User: User
}