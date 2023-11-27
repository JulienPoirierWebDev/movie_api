const express = require("express");
const router = express.Router();

const {
  removeItemFromCollection,
  addItemToCollection,
  getCollectionFromCurrentUser,
  getCollections,
} = require("../controllers/collectionsController.js");

const verifyAndAddMovie = require("../middlewares/verifyAndAddMovie");
const verifyToken = require("../middlewares/verifyToken");

router.get("/me", verifyToken, getCollectionFromCurrentUser);

router.get("/", getCollections);

router.post("/movies", verifyToken, verifyAndAddMovie, addItemToCollection);

router.delete("/movies", verifyToken, removeItemFromCollection);

module.exports = router;
