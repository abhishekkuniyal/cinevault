import Movie from "../models/Movie.js";
import interpretMood from "../services/ai/moodSearch.js";
import { searchMovies, discoverMovies } from "../services/tmdb.services.js";

const FALLBACK_CATALOG = [
  {
    id: "fallback-1",
    tmdbId: 693134,
    title: "Dune: Part Two",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    keywords: ["epic-scale", "world-building", "desert", "prophecy"],
    year: 2024,
    rating: 8.8,
    aiMatch: 98
  },
  {
    id: "fallback-2",
    tmdbId: 872585,
    title: "Oppenheimer",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    genres: ["Drama", "History"],
    keywords: ["historical", "intense", "biography", "thought-provoking"],
    year: 2023,
    rating: 8.9,
    aiMatch: 95
  },
  {
    id: "fallback-3",
    tmdbId: 335984,
    title: "Blade Runner 2049",
    synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.",
    posterUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    keywords: ["rain-slicked", "synth-score", "atmospheric", "cyberpunk", "mind-bending"],
    year: 2017,
    rating: 8.4,
    aiMatch: 97
  },
  {
    id: "fallback-4",
    tmdbId: 157336,
    title: "Interstellar",
    synopsis: "When Earth becomes uninhabitable, a team of researchers travels through a wormhole in space to ensure humanity's survival.",
    posterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    keywords: ["cosmic", "emotional", "mind-bending", "space"],
    year: 2014,
    rating: 8.7,
    aiMatch: 96
  },
  {
    id: "fallback-5",
    tmdbId: 545611,
    title: "Everything Everywhere All at Once",
    synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes.",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    keywords: ["multiverse", "existential", "mind-bending", "fast-paced"],
    year: 2022,
    rating: 8.8,
    aiMatch: 93
  },
  {
    id: "fallback-6",
    tmdbId: 414906,
    title: "The Batman",
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
    genres: ["Action", "Crime", "Drama", "Mystery"],
    keywords: ["rain-slicked", "noir", "gritty", "dark", "detective"],
    year: 2022,
    rating: 7.8,
    aiMatch: 91
  },
  {
    id: "fallback-7",
    tmdbId: 27205,
    title: "Inception",
    synopsis: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop",
    genres: ["Sci-Fi", "Action", "Adventure"],
    keywords: ["mind-bending", "twist-ending", "heist", "dreams"],
    year: 2010,
    rating: 8.8,
    aiMatch: 99
  },
  {
    id: "fallback-8",
    tmdbId: 603,
    title: "The Matrix",
    synopsis: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth about his reality.",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1200&auto=format&fit=crop",
    genres: ["Sci-Fi", "Action"],
    keywords: ["cyberpunk", "synth-score", "mind-bending", "dystopian"],
    year: 1999,
    rating: 8.7,
    aiMatch: 95
  },
  {
    id: "fallback-9",
    tmdbId: 466272,
    title: "Once Upon a Time in Hollywood",
    synopsis: "A faded television actor and his stunt double strive to achieve fame and success in the final years of Hollywood's Golden Age in 1969 Los Angeles.",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    genres: ["Comedy", "Drama"],
    keywords: ["feel-good", "nostalgic", "hollywood", "witty"],
    year: 2019,
    rating: 7.6,
    aiMatch: 88
  },
  {
    id: "fallback-10",
    tmdbId: 475557,
    title: "Joker",
    synopsis: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City.",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    backdropUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    genres: ["Crime", "Drama", "Thriller"],
    keywords: ["dark", "intense", "psychological", "gritty"],
    year: 2019,
    rating: 8.4,
    aiMatch: 92
  }
];

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

function mapTmdbGenres(genreIds, defaultGenres = []) {
  if (!Array.isArray(genreIds) || genreIds.length === 0) {
    return defaultGenres.length > 0 ? defaultGenres : ["Drama", "Thriller"];
  }
  const mapped = genreIds.map(id => TMDB_GENRE_MAP[id]).filter(Boolean);
  return mapped.length > 0 ? mapped : (defaultGenres.length > 0 ? defaultGenres : ["Drama"]);
}

async function searchByMood(req, res) {
  try {
    const { mood } = req.body;

    if (!mood || !mood.trim()) {
      return res.status(400).json({ message: "mood text is required" });
    }

    const { genres = [], keywords = [] } = await interpretMood(mood);
    const moodClean = mood.trim().toLowerCase();
    let movies = [];
    const seenIds = new Set();

    // 1. Search TMDB with the user's EXACT mood/search input!
    try {
      const tmdbData = await searchMovies(mood.trim());
      if (tmdbData && Array.isArray(tmdbData.results)) {
        tmdbData.results.forEach((m) => {
          const poster = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
          const backdrop = m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : poster;
          const movieGenres = mapTmdbGenres(m.genre_ids, genres);
          
          if (!seenIds.has(String(m.id))) {
            seenIds.add(String(m.id));
            movies.push({
              id: String(m.id),
              tmdbId: m.id,
              title: m.title,
              synopsis: m.overview || 'No synopsis available.',
              posterUrl: poster,
              backdropUrl: backdrop,
              poster: poster,
              backdrop: backdrop,
              genres: movieGenres,
              year: m.release_date ? parseInt(m.release_date.split("-")[0]) : null,
              rating: m.vote_average || 8.0,
              aiMatch: 95
            });
          }
        });
      }
    } catch (err) {
      console.warn("TMDB exact mood search notice:", err.message);
    }

    // 2. If exact TMDB search returned few results, try searching TMDB by primary genre/keyword
    if (movies.length < 5 && (genres.length > 0 || keywords.length > 0)) {
      try {
        const secondaryQuery = genres[0] || keywords[0];
        if (secondaryQuery) {
          const tmdbSecondary = await searchMovies(secondaryQuery);
          if (tmdbSecondary && Array.isArray(tmdbSecondary.results)) {
            tmdbSecondary.results.forEach((m) => {
              if (!seenIds.has(String(m.id))) {
                seenIds.add(String(m.id));
                const poster = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
                const backdrop = m.backdrop_path ? `https://image.tmdb.org/t/p/original${m.backdrop_path}` : poster;
                movies.push({
                  id: String(m.id),
                  tmdbId: m.id,
                  title: m.title,
                  synopsis: m.overview || 'No synopsis available.',
                  posterUrl: poster,
                  backdropUrl: backdrop,
                  poster: poster,
                  backdrop: backdrop,
                  genres: mapTmdbGenres(m.genre_ids, genres),
                  year: m.release_date ? parseInt(m.release_date.split("-")[0]) : null,
                  rating: m.vote_average || 8.0,
                  aiMatch: 88
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn("TMDB secondary search notice:", err.message);
      }
    }

    // 3. Search local MongoDB database
    try {
      const genreRegexes = genres.map(g => new RegExp(g, "i"));
      const keywordRegexes = keywords.map(k => new RegExp(k, "i"));

      let dbMovies = await Movie.find({
        $or: [
          { title: { $regex: moodClean, $options: "i" } },
          { overview: { $regex: moodClean, $options: "i" } },
          { genres: { $in: genreRegexes } },
          { aiTags: { $in: keywordRegexes } }
        ],
      })
        .sort({ avgRating: -1 })
        .limit(20);

      dbMovies.forEach(m => {
        const idStr = String(m.tmdbId || m._id);
        if (!seenIds.has(idStr)) {
          seenIds.add(idStr);
          const poster = m.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
          const backdrop = m.backdropUrl || poster;
          movies.push({
            id: idStr,
            tmdbId: m.tmdbId,
            title: m.title,
            synopsis: m.overview,
            posterUrl: poster,
            backdropUrl: backdrop,
            poster: poster,
            backdrop: backdrop,
            genres: m.genres || [],
            year: m.releaseDate ? parseInt(new Date(m.releaseDate).getFullYear()) : null,
            rating: m.avgRating || 8.5,
            aiMatch: 92
          });
        }
      });
    } catch (dbErr) {
      console.warn("MongoDB search notice:", dbErr.message);
    }

    // 4. Calculate dynamic AI match percentage and relevance score for each movie
    const targetGenresLower = genres.map(g => g.toLowerCase());
    const targetKeywordsLower = keywords.map(k => k.toLowerCase());

    movies.forEach(m => {
      let score = 70;
      const titleLower = (m.title || '').toLowerCase();
      const synopsisLower = (m.synopsis || '').toLowerCase();

      // Title contains user query: big boost
      if (titleLower.includes(moodClean) || moodClean.includes(titleLower)) score += 25;
      // Synopsis contains user query or keywords
      if (synopsisLower.includes(moodClean)) score += 15;
      
      (m.genres || []).forEach(g => {
        if (targetGenresLower.some(tg => g.toLowerCase().includes(tg) || tg.includes(g.toLowerCase()))) {
          score += 10;
        }
      });

      targetKeywordsLower.forEach(k => {
        if (synopsisLower.includes(k) || titleLower.includes(k)) score += 8;
      });

      m.aiMatch = Math.min(99, Math.max(78, score));
    });

    // Sort by AI match descending
    movies.sort((a, b) => (b.aiMatch || 0) - (a.aiMatch || 0));

    // 5. Fallback catalog matching ONLY IF 0 movies were found from live TMDB and DB
    if (movies.length === 0) {
      const sortedFallback = [...FALLBACK_CATALOG].sort((a, b) => {
        let scoreA = 0;
        let scoreB = 0;

        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA.includes(moodClean)) scoreA += 30;
        if (titleB.includes(moodClean)) scoreB += 30;

        a.genres.forEach(g => { if (targetGenresLower.includes(g.toLowerCase())) scoreA += 5; });
        a.keywords.forEach(k => { if (targetKeywordsLower.includes(k.toLowerCase())) scoreA += 3; });

        b.genres.forEach(g => { if (targetGenresLower.includes(g.toLowerCase())) scoreB += 5; });
        b.keywords.forEach(k => { if (targetKeywordsLower.includes(k.toLowerCase())) scoreB += 3; });

        return scoreB - scoreA;
      });

      // Filter fallback catalog to items with relevance
      movies = sortedFallback.slice(0, 10);
    }

    return res.status(200).json({ mood, interpreted: { genres, keywords }, movies });
  } catch (error) {
    console.error("Critical error in searchByMood:", error);
    return res.status(200).json({
      mood: req.body.mood || "",
      interpreted: { genres: ["Action", "Sci-Fi"], keywords: ["epic", "thrilling"] },
      movies: FALLBACK_CATALOG
    });
  }
}

export { searchByMood };