import { fetchMovie, fetchCredits, searchMovies, getTrendingMovies } from "../services/tmdb.services.js";
import generateTags from "../services/ai/autoTagger.js";

import mapMovieData from "../utils/mapMovieData.js";
import Movie from "../models/Movie.js";

async function syncMovie(req, res) {
  try {
    const { tmdbId } = req.params;

    if (!tmdbId) {
      return res.status(400).json({ message: "tmdbId is required" });
    }

    const movieData = await fetchMovie(tmdbId);
    const creditsData = await fetchCredits(tmdbId);

    const mappedMovie = mapMovieData(movieData, creditsData);

    const movie = await Movie.findOneAndUpdate(
      { tmdbId: mappedMovie.tmdbId },
      { ...mappedMovie, lastSyncedAt: new Date() },
      { upsert: true, new: true, setDefaultValues: true },
    );

    return res
      .status(200)
      .json({ message: "Movie synced successfully", movie });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
async function generateMovieTags(req, res) {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const aiTags = await generateTags(movie);

    movie.aiTags = aiTags;
    await movie.save();

    return res.status(200).json({ message: "Tags generated", movie });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
async function getMovies(req, res) {
  try {
    const { search, genre } = req.query;
    let tmdbResults = [];

    try {
      if (search) {
        const data = await searchMovies(search);
        tmdbResults = data.results || [];
      } else {
        const data = await getTrendingMovies();
        tmdbResults = data.results || [];
      }
    } catch (err) {
      console.warn("TMDB API request failed, falling back to MongoDB or fallback catalog:", err.message);
      let dbMovies = [];
      try {
        let query = {};
        if (search) query.title = { $regex: search, $options: "i" };
        if (genre) query.genres = { $in: [new RegExp(genre, "i")] };
        dbMovies = await Movie.find(query).limit(20);
      } catch (dbErr) {
        console.warn("MongoDB query failed:", dbErr.message);
      }

      if (dbMovies.length > 0) {
        const movies = dbMovies.map(m => {
          const poster = m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
          const backdrop = m.backdropUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop";
          return {
            id: String(m.tmdbId || m._id),
            tmdbId: m.tmdbId,
            title: m.title,
            synopsis: m.overview,
            posterUrl: poster,
            backdropUrl: backdrop,
            poster: poster,
            backdrop: backdrop,
            genres: m.genres || [],
            year: m.releaseDate ? parseInt(new Date(m.releaseDate).getFullYear()) : null,
            rating: m.avgRating || 8.0,
            aiMatch: 85
          };
        });
        return res.status(200).json({ movies });
      }

      const FALLBACK_MOVIES = [
        {
          id: "movie-1",
          tmdbId: "693134",
          title: "Dune: Part Two",
          synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
          posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
          genres: ["Sci-Fi", "Adventure", "Drama"],
          year: 2024,
          rating: 8.8,
          aiMatch: 98
        },
        {
          id: "movie-2",
          tmdbId: "872585",
          title: "Oppenheimer",
          synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
          posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          genres: ["Biography", "Drama", "History"],
          year: 2023,
          rating: 8.9,
          aiMatch: 95
        },
        {
          id: "movie-3",
          tmdbId: "335984",
          title: "Blade Runner 2049",
          synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
          posterUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          genres: ["Sci-Fi", "Mystery", "Thriller"],
          year: 2017,
          rating: 8.4,
          aiMatch: 96
        },
        {
          id: "movie-4",
          tmdbId: "157336",
          title: "Interstellar",
          synopsis: "When Earth becomes uninhabitable, a team of researchers travels through a wormhole in space to ensure humanity's survival.",
          posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
          genres: ["Adventure", "Drama", "Sci-Fi"],
          year: 2014,
          rating: 8.7,
          aiMatch: 94
        },
        {
          id: "movie-5",
          tmdbId: "545611",
          title: "Everything Everywhere All at Once",
          synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence.",
          posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
          genres: ["Action", "Adventure", "Comedy"],
          year: 2022,
          rating: 8.8,
          aiMatch: 92
        },
        {
          id: "movie-6",
          tmdbId: "414906",
          title: "The Batman",
          synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.",
          posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
          backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
          poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
          backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
          genres: ["Action", "Crime", "Drama"],
          year: 2022,
          rating: 7.8,
          aiMatch: 90
        }
      ];

      let filtered = FALLBACK_MOVIES;
      if (search) {
        filtered = filtered.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.synopsis.toLowerCase().includes(search.toLowerCase()));
      }
      if (genre && genre !== "All") {
        filtered = filtered.filter(m => m.genres.some(g => g.toLowerCase().includes(genre.toLowerCase())));
      }

      return res.status(200).json({ movies: filtered.length > 0 ? filtered : FALLBACK_MOVIES });
    }

const TMDB_GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

function mapTmdbGenres(genreIds) {
  if (!Array.isArray(genreIds) || genreIds.length === 0) return ["Drama", "Thriller"];
  const mapped = genreIds.map(id => TMDB_GENRE_MAP[id]).filter(Boolean);
  return mapped.length > 0 ? mapped : ["Drama"];
}

    // Map TMDB results to our schema format for the frontend
    const movies = tmdbResults.slice(0, 20).map((movie) => {
      const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
      const backdrop = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : poster;
      return {
        id: String(movie.id),
        tmdbId: movie.id,
        title: movie.title,
        synopsis: movie.overview,
        posterUrl: poster,
        backdropUrl: backdrop,
        poster: poster,
        backdrop: backdrop,
        genres: mapTmdbGenres(movie.genre_ids),
        year: movie.release_date ? parseInt(movie.release_date.split("-")[0]) : null,
        rating: movie.vote_average,
        aiMatch: Math.floor(Math.random() * 30) + 70
      };
    });

    return res.status(200).json({ movies });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getMovieById(req, res) {
  try {
    const { movieId } = req.params;
    
    // Check local DB first
    let movie = await Movie.findOne({ tmdbId: movieId }) || await Movie.findById(movieId).catch(() => null);
    
    if (!movie) {
      // Fetch from TMDB if not in DB
      try {
        const movieData = await fetchMovie(movieId);
        const creditsData = await fetchCredits(movieId);
        const mappedMovie = mapMovieData(movieData, creditsData);
        
        movie = await Movie.findOneAndUpdate(
          { tmdbId: mappedMovie.tmdbId },
          { ...mappedMovie, lastSyncedAt: new Date() },
          { upsert: true, new: true, setDefaultValues: true }
        );
      } catch (err) {
        return res.status(404).json({ message: "Movie not found on TMDB" });
      }
    }
    
    const poster = movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
    const backdrop = movie.backdropUrl || poster;

    // Transform to frontend expected format
    const formattedMovie = {
      id: String(movie.tmdbId),
      tmdbId: movie.tmdbId,
      title: movie.title,
      synopsis: movie.overview,
      poster: poster,
      backdrop: backdrop,
      posterUrl: poster,
      backdropUrl: backdrop,
      genres: movie.genres || [],
      year: movie.releaseDate ? parseInt(new Date(movie.releaseDate).getFullYear()) : null,
      rating: movie.avgRating || 8.5,
      director: movie.director,
      cast: movie.cast,
      aiMatch: Math.floor(Math.random() * 20) + 80,
      aiInsight: "This film aligns with your preference for thought-provoking narratives and stunning visual composition."
    };

    return res.status(200).json({ movie: formattedMovie });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { syncMovie, generateMovieTags, getMovies, getMovieById };
