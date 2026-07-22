import axios from "axios";
import https from "node:https";
import "dotenv/config";

const accessToken = process.env.TMDB_ACCESS_TOKEN;
const movieData = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  httpsAgent: new https.Agent({ keepAlive: true }),
  timeout: 10000,
});

// movie detail
async function fetchMovie(tmbdId) {
  try {
    const getMovie = await movieData.get(`/movie/${tmbdId}`);
    return getMovie.data;
  } catch (error) {
    console.error("TMDB fetch error:", error.message);
    throw error;
  }
}

// movie credits
async function fetchCredits(tmdbId) {
  try {
    const getCredits = await movieData.get(`/movie/${tmdbId}/credits`);
    return getCredits.data;
  } catch (error) {
    console.error("TMDB fetch error:", error.message);
    throw error;
  }
}
async function searchMovies(query) {
  try {
    const res = await movieData.get('/search/movie', { params: { query } });
    return res.data;
  } catch (error) {
    console.error("TMDB search error:", error.message);
    throw error;
  }
}

async function getTrendingMovies() {
  try {
    const res = await movieData.get('/trending/movie/day');
    return res.data;
  } catch (error) {
    console.error("TMDB trending error:", error.message);
    throw error;
  }
}

async function discoverMovies(params = {}) {
  try {
    const res = await movieData.get('/discover/movie', { params });
    return res.data;
  } catch (error) {
    console.error("TMDB discover error:", error.message);
    throw error;
  }
}

export { fetchMovie, fetchCredits, searchMovies, getTrendingMovies, discoverMovies };

