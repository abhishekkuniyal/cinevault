import List from "../models/List.js";
import Movie from "../models/Movie.js";
import Activity from "../models/Activity.js";

// CREATE a new list
async function createList(req, res) {
  try {
    const { name, isPublic } = req.body;
    const { id: userId } = req.user;

    if (!name) {
      return res.status(400).json({ message: "List name is required" });
    }

    const list = await List.create({
      userId,
      name,
      isPublic: isPublic !== undefined ? isPublic : true,
    });
    await Activity.create({
      userId,
      type: "list_created",
      targetList: list._id,
    });
    return res.status(201).json({ message: "List created successfully", list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET all lists for the logged-in user
async function getMyLists(req, res) {
  try {
    const { id: userId } = req.user;

    const lists = await List.find({ userId }).populate(
      "movies",
      "title posterUrl",
    );

    return res.status(200).json({ lists });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET a single list by id (public lists viewable by anyone, private only by owner)
async function getListById(req, res) {
  try {
    const { listId } = req.params;

    const list = await List.findById(listId).populate(
      "movies",
      "title posterUrl avgRating",
    );

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (!list.isPublic) {
      if (!req.user || list.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "This list is private" });
      }
    }

    return res.status(200).json({ list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// ADD a movie to a list
async function addMovieToList(req, res) {
  try {
    const { listId } = req.params;
    const { movieId } = req.body;
    const { id: userId } = req.user;

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" });
    }

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this list" });
    }

    const movieExists = await Movie.findById(movieId);
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const alreadyInList = list.movies.some((m) => m.toString() === movieId);
    if (alreadyInList) {
      return res.status(400).json({ message: "Movie already in this list" });
    }

    list.movies.push(movieId);
    await list.save();

    return res.status(200).json({ message: "Movie added to list", list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// REMOVE a movie from a list
async function removeMovieFromList(req, res) {
  try {
    const { listId, movieId } = req.params;
    const { id: userId } = req.user;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this list" });
    }

    list.movies = list.movies.filter((m) => m.toString() !== movieId);
    await list.save();

    return res.status(200).json({ message: "Movie removed from list", list });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// DELETE a list
async function deleteList(req, res) {
  try {
    const { listId } = req.params;
    const { id: userId } = req.user;

    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this list" });
    }

    await list.deleteOne();

    return res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

export {
  createList,
  getMyLists,
  getListById,
  addMovieToList,
  removeMovieFromList,
  deleteList,
};
