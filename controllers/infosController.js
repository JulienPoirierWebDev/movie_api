const { requestOneMovieFromTMDBApi } = require("../services/movieDatabase.api");

const getInfosOfMovie = async (req, res) => {
  try {
    const id = req.params.id;

    const movie = await requestOneMovieFromTMDBApi(id);

    res.status(200).json(movie);
  } catch (err) {
    res.status(500).send("Error while getting the movies");
  }
};

const getInfosOfSerie = async (req, res) => {
  try {
    const id = req.params.id;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/tv/${id}?language=fr-FR`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const request = await response.json();
    res.status(200).json(request);
  } catch (err) {
    res.status(500).send("Error while getting the movies");
  }
};

const getInfosOfCollection = async (req, res) => {
  try {
    const id = req.params.id;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/collection/${id}?language=fr-FR`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const request = await response.json();
    res.status(200).json(request);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while getting the movies");
  }
};

module.exports = { getInfosOfSerie, getInfosOfMovie, getInfosOfCollection };
