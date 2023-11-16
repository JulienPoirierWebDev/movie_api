require("dotenv").config();
const express = require("express");
const fs = require("fs");

const app = express();

app.use((req, res, next) => {
  try {
    fs.readFile("./log.json", (err, data) => {
      const log = JSON.parse(data);
      console.log(log);
      log.use = log.use + 1;
      const newData = JSON.stringify(log);
      fs.writeFile("./log.json", newData, (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

app.get("/logs", (req, res) => {
  const logJson = fs.readFileSync("./log.json");
  const log = JSON.parse(logJson);
  res.status(200).json(log);
});

app.get("/search/movie/:qmovie/:page?", async (req, res) => {
  try {
    const movie = req.params.qmovie;
    const page = req.params.page;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=fr-FR&page=${
      page ? page : 1
    }&query=${movie}`;
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

app.get("/search/serie/:q", async (req, res) => {
  try {
    const serie = req.params.q;
    const TOKEN = process.env.TMDB_TOKEN;
    const url = `https://api.themoviedb.org/3/search/tv?include_adult=false&language=fr-FR&page=1&query=${serie}`;
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

app.get("/infos/movie/:id", async (req, res) => {
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

app.get("/infos/serie/:id", async (req, res) => {
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

app.get("/infos/collection/:id", async (req, res) => {
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
  } catch (err) {
    console.log(err);
    res.status(500).send("Error while getting the movies");
  }
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
