import express from "express";
import {
  createList,
  getMyLists,
  getListById,
  addMovieToList,
  removeMovieFromList,
  deleteList,
} from "../controllers/list.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const listRouter = express.Router();

listRouter.post("/", verifyToken, createList);
listRouter.get("/my-lists", verifyToken, getMyLists);
listRouter.get("/:listId", getListById);
listRouter.put("/:listId/add-movie", verifyToken, addMovieToList);
listRouter.delete(
  "/:listId/remove-movie/:movieId",
  verifyToken,
  removeMovieFromList,
);
listRouter.delete("/:listId", verifyToken, deleteList);

export default listRouter;
