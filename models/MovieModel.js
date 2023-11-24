const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  originalTitle: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  director: { type: String },
  duration: { type: Number },
  poster: { type: String, required: true },
  backdrop: { type: String, required: true },
  rate: { type: Number, required: true },
  overview: { type: String, required: true },
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
