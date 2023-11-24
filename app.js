require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const databaseConnection = require("./utils/mongo_db");
const User = require("./models/UserModel");
const searchRouter = require("./routes/searchRouter");
const infosRouter = require("./routes/infosRouter");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const sessionMiddleware = require("./middlewares/sessionMiddleware");
const {
  requestOneMovieFromTMDBApi,
} = require("./services/movieDatabase.api.js");

const List = require("./models/ListModel");
const Movie = require("./models/MovieModel");

const verifyToken = require("./middlewares/verifyToken.js");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

databaseConnection();

app.use(sessionMiddleware);
app.use(loggerMiddleware);

app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the protected route" });
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

      const movieFromTMDB = await requestOneMovieFromTMDBApi(movieId);

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

app.get("/collection", verifyToken, async (req, res) => {
  try {
    const user = req.user;

    const listUser = await List.findOne({ user: user.id })
      .populate("movies")
      .exec();

    if (!listUser) {
      res.status(400).json({ message: "List not found" });
      return;
    }

    res.status(200).json(listUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

app.post(
  "/collection/add",
  verifyToken,
  verifyAndAddMovie,
  async (req, res) => {
    try {
      const user = req.user;

      let listUser = await List.findOne({ user: user.id }).exec();

      if (!listUser) {
        const newList = new List({
          name: "My collection",
          user: user.id,
        });

        listUser = await newList.save();
      }

      const movie = req.movie;

      const isMovieAlreadyInCollection = listUser.movies.includes(
        movie._id.toString()
      );

      if (isMovieAlreadyInCollection) {
        res.status(400).json({ message: "Movie already in collection" });
        return;
      }

      listUser.movies.push(movie._id.toString());

      await listUser.save();

      res.status(200).json({ message: "Movie added to collection", listUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
    }
  }
);

app.post("/collection/remove", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const { movieId } = req.body;

    if (!movieId) {
      res.status(400).json({ message: "Missing parameters" });
      return;
    }

    const listUser = await List.findOne({ user: user.id })
      .populate("movies")
      .exec();

    if (!listUser) {
      res.status(400).json({ message: "List not found" });
      return;
    }

    const movieInListUser = listUser.movies.filter((movie) => {
      return movie.id === movieId;
    });

    if (movieInListUser.length === 0) {
      res.status(400).json({ message: "Movie not found in list" });
      return;
    }

    listUser.movies.splice(movieInListUser, 1);

    await listUser.save();

    res.status(200).json({ message: "Movie removed from collection" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
});

app.post("/users/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Missing parameters" });
    return;
  }

  const testIfUserWithThisEmailExist = await User.findOne({
    email: email,
  }).exec();

  if (Boolean(testIfUserWithThisEmailExist)) {
    res.status(400).json({ message: "User already exist" });
    return;
  }

  const saltRound = 10;
  const hashPassword = await bcrypt.hash(password, saltRound);

  const newUser = new User({
    name,
    email,
    hashPassword: hashPassword,
  });

  newUser.save();

  res.status(201).json({ message: "User created" });
});

app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Missing parameters" });
    return;
  }

  const user = await User.findOne({ email: email }).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashPassword);

  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid password" });
    return;
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  req.session.jwt = token;
  req.session.id = user._id;

  res.status(200).json({ message: "User logged in", token: token });
});

app.use("/search", searchRouter);

app.use("/infos", infosRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
