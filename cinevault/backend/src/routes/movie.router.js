import express from "express";
import { generateMovieTags, syncMovie, getMovies, getMovieById } from "../controllers/movie.controller.js";

const movieRouter = express.Router();

movieRouter.get("/", getMovies);
movieRouter.get("/:movieId", getMovieById);
movieRouter.post("/:movieId/generate-tags", generateMovieTags);
movieRouter.post("/sync/:tmdbId", syncMovie);

export default movieRouter;
