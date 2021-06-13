const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Schema = mongoose.Schema;

const { MONGO_URI } = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../dist/config.json"))
);
//_id is a key given to every document made with mongo. To access the document by id# pass in _id
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: "Pollr",
  })
  .then(() => console.log("Connected to Mongo DB."))
  .catch((err) => console.log(err));

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  pollCreator: Boolean,
  pollsList: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
});

const User = mongoose.model("User", userSchema);

const pollSchema = new Schema({
  pollQuestion: String,
  pollOptions: Array,
  pollResponse: String,
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = {
  User,
  Poll,
};
