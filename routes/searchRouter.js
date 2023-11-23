const express = require("express");
const router = express.Router();

router.get("/movies/:qmovie/:page?", async (req, res) => {
  try {
    const movie = req.params.qmovie;
    const page = req.params.page;
    const TOKEN = process.env.TMDB_TOKEN;
    const urlPage = page ? page : 1;
    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=fr-FR&page=${urlPage}&query=${movie}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const request = await response.json();
    res.status(200).json(request.results);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while getting the movies");
  }
});

router.get("/series/:q/:page?", async (req, res) => {
  try {
    const serie = req.params.q;
    const page = req.params.page;
    const urlPage = page ? page : 1;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/search/tv?include_adult=false&language=fr-FR&page=${urlPage}&query=${serie}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const request = await response.json();
    res.status(200).json(request.results);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while getting the movies");
  }
});

module.exports = router;
