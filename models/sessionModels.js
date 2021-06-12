
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId : String,
  //might not work lol
  createdAt: {type: Date, expires: 60}
});
const Session = mongoose.model('Session', sessionSchema);

module.exports = {
  Session
};