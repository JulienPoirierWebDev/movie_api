const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const List = mongoose.model("List", listSchema);

module.exports = List;
