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
  .then(async () => {
    console.log("Connected to Mongo DB.");
  })
  .catch((err) => console.log(err));
console.log("Inside the Mongoose connection");

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  pollsList: [{ type: Schema.Types.ObjectId, ref: "Poll" }],
});

const User = mongoose.model("User", userSchema);

const pollSchema = new Schema({
  method: { type: String, required: true },
  question: { type: String, required: true },
  options: [String],
  creatorId: {
    // type: Schema.Types.ObjectId,
    type: String,
    // ref: "User",
    required: true,
  },
  pollId: { type: String, required: true },
  voteCount: Number,
  responses: [
    {
      userId: String,
      vote: Number,
    },
  ],
  joined: [String],
  winner: {
    option: String,
    count: Number,
  },
  active: Boolean,
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = {
  User,
  Poll,
};
