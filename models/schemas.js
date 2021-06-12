const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//_id is a key given to every document made with mongo. To access the document by id# pass in _id

const userSchema = new Schema({
    username: {type:String, required : true},
    password: {type:String, required : true},
    pollCreator: Boolean,
    pollsList: [{type: Schema.Type.ObjectId, ref: 'Poll'}]
});

const User = mongoose.model('User', userSchema);

const pollSchema = new Schema ({
    pollQuestion: String,
    pollOptions: Array,
    pollResponse: String,
});

const Poll = mongoose.model('Poll', pollSchema);

const sessionSchema = newSchema({
    sessionId : String
});
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
    User, 
    Poll, 
    Session
}