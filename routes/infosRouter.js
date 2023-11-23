const express = require("express");

const router = express.Router();

router.get("/movies/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/movie/${id}?language=fr-FR`;
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
});

router.get("/series/:id", async (req, res) => {
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
});

router.get("/collections/:id", async (req, res) => {
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
});

module.exports = router;
