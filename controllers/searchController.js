const {
  requestSearchMovieFromTMDBApi,
} = require("../services/movieDatabase.api");

const searchController = {};
searchController.queryMovie = async (req, res) => {
  try {
    const movie = req.params.qmovie;
    const page = req.params.page;

    const searchResult = await requestSearchMovieFromTMDBApi(page, movie);

    res.status(200).json(searchResult);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while getting the movies");
  }
};

module.exports = searchController;
