const express = require("express");

const router = express.Router();

const {
  getInfosOfMovie,
  getInfosOfSerie,
  getInfosOfCollection,
} = require("../controllers/infosController");

router.get("/movies/:id", getInfosOfMovie);

router.get("/series/:id", getInfosOfSerie);

router.get("/collections/:id", getInfosOfCollection);

module.exports = router;
