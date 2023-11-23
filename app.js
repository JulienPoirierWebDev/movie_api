require("dotenv").config();
const express = require("express");
const fs = require("fs");

const searchRouter = require("./routes/searchRouter");

const app = express();

app.use((req, res, next) => {
  console.log(req.url);

  if (req.url === "/logs") {
    next();
    return;
  }

  function writeLog(newLog) {
    fs.writeFile("./log.json", newLog, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  try {
    fs.readFile("./log.json", (err, data) => {
      const log = JSON.parse(data);
      console.log(log);
      log.use = log.use + 1;
      const newData = JSON.stringify(log);

      writeLog(newData);
    });
    next();
  } catch (error) {
    console.log(error);
    next();
  }
});

app.get("/logs", async (req, res) => {
  fs.readFile("./log.json", (err, data) => {
    if (err) {
      console.log(err);
    }
    const log = JSON.parse(data);
    res.status(200).json(log);
  });
});

app.use("/search", searchRouter);

app.get("/infos/movies/:id", async (req, res) => {
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

app.get("/infos/series/:id", async (req, res) => {
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

app.get("/infos/collections/:id", async (req, res) => {
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

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
