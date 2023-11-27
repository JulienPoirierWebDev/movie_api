const List = require("../models/ListModel.js");

exports.removeItemFromCollection = async (req, res) => {
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
};

exports.addItemToCollection = async (req, res) => {
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
};

exports.getCollectionFromCurrentUser = async (req, res) => {
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
};

exports.getCollections = async (req, res) => {
  try {
    const lists = await List.find().populate("movies").populate("user").exec();

    res.status(200).json(lists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
};
