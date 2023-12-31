const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  hashPassword: String,
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
