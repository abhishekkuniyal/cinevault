import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  overview: String,
  posterUrl: String,
  backdropUrl: String,
  genres: [String],
  releaseDate: Date,
  runtime: Number,
  director: String,
  cast: [String],
  aiTags: [String],
  avgRating: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
  lastSyncedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;

