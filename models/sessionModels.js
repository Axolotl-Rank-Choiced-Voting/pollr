const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
  sessionId: String,
  //might not work lol
  createdAt: { type: Date, expires: 90, default: Date.now },
});
const Session = mongoose.model("Session", sessionSchema);

module.exports = {
  Session,
};
