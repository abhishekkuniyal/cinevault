import cron from "node-cron";
import { fetchMovie, fetchCredits } from "../services/tmdb.services.js";
import mapMovieData from "../utils/mapMovieData.js";
import Movie from "../models/Movie.js";
import axios from "axios";
import "dotenv/config";

async function getTrendingMovieIds() {
  const response = await axios.get(
    "https://api.themoviedb.org/3/trending/movie/week",
    {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        Accept: "application/json",
      },
    }
  );

  return response.data.results.map((movie) => movie.id);
}

async function syncTrendingMovies() {
  try {
    console.log("Starting trending movies sync...");

    const trendingIds = await getTrendingMovieIds();

    for (const tmdbId of trendingIds) {
      try {
        const movieData = await fetchMovie(tmdbId);
        const creditsData = await fetchCredits(tmdbId);
        const mappedMovie = mapMovieData(movieData, creditsData);

        await Movie.findOneAndUpdate(
          { tmdbId: mappedMovie.tmdbId },
          { ...mappedMovie, lastSyncedAt: new Date() },
          { upsert: true, new: true }
        );

        console.log(`Synced: ${mappedMovie.title}`);
      } catch (err) {
        console.error(`Failed to sync movie ${tmdbId}:`, err.message);
      }
    }

    console.log("Trending movies sync complete.");
  } catch (error) {
    console.error("Trending sync job failed:", error.message);
  }
}

// Runs every day at 3:00 AM
cron.schedule("0 3 * * *", () => {
  syncTrendingMovies();
});

export default syncTrendingMovies;