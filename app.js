require("dotenv").config();
const express = require("express");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const searchRouter = require("./routes/searchRouter");
const infosRouter = require("./routes/infosRouter");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongoose = require("mongoose");

const databaseConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/movies_api");
    console.log("Success to connect MongoDB");
  } catch (error) {
    console.log("Failed to connect MongoDB");
    console.log(error);
  }
};

databaseConnection();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  hashPassword: String,
});

const User = mongoose.model("User", userSchema);

const verifyToken = (req, res, next) => {
  const authorizationHeaders = req.headers.authorization;

  const token = authorizationHeaders.split(" ")[1];

  console.log(token);

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    next();
  });
};

app.use((req, res, next) => {
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
