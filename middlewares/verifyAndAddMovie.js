const Movie = require("../models/MovieModel");

const verifyAndAddMovie = async (req, res, next) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      res.status(400).json({ message: "Missing parameters" });
      return;
    }

    let movie = await Movie.findOne({ id: movieId }).exec();

    if (!movie) {
      console.log("Movie not found");
      let movieFromTMDB = null;
      try {
        movieFromTMDB = await requestOneMovieFromTMDBApi(movieId);
      } catch (error) {
        res.status(500).json({ message: "This movieId not exist in TMDB" });
        return;
      }

      if (movieFromTMDB.error) {
        res.status(400).json({ message: "Movie not found" });
        return;
      }

      movie = new Movie({
        id: movieFromTMDB.id,
        title: movieFromTMDB.title,
        originalTitle: movieFromTMDB.original_title,
        poster:
          "https://image.tmdb.org/t/p/original/" + movieFromTMDB.poster_path,
        backdrop:
          "https://image.tmdb.org/t/p/original/" + movieFromTMDB.backdrop_path,
        releaseDate: movieFromTMDB.release_date,
        overview: movieFromTMDB.overview,
        rate: movieFromTMDB.vote_average,
      });

      await movie.save();
    }

    req.movie = movie;

    next();
  } catch (error) {
    res.status(500).json({ message: "Error in middleware verifyAndAddMovie" });
  }
};

module.exports = verifyAndAddMovie;
