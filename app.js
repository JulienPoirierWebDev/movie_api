require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const databaseConnection = require("./utils/mongo_db");
const User = require("./models/UserModel");
const searchRouter = require("./routes/searchRouter");
const infosRouter = require("./routes/infosRouter");
const collectionsRouter = require("./routes/collectionsRouter");
const loggerMiddleware = require("./middlewares/loggerMiddleware");
const sessionMiddleware = require("./middlewares/sessionMiddleware");
const {
  requestOneMovieFromTMDBApi,
} = require("./services/movieDatabase.api.js");

const List = require("./models/ListModel.js");
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

app.post("/users/", async (req, res) => {
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

app.get("/users/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Error while logging out" });
      return;
    }

    res.status(200).json({ message: "User logged out" });
  });
});

app.use("/search", searchRouter);
app.use("/infos", infosRouter);
app.use("/collections", collectionsRouter);

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
