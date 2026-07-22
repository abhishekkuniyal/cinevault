export const MOCK_MOVIES = [
  {
    id: "movie-1",
    title: "Dune: Part Two",
    year: 2024,
    rating: 8.8,
    duration: "2h 46m",
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Adventure", "Drama"],
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600&auto=format&fit=crop",
    synopsis: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.",
    aiMatch: 98,
    aiTasteTag: "Epic Sci-Fi Spectacle",
    aiInsight: "98% match based on your preference for grand world-building, Hans Zimmer scores, and complex political intrigue.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"],
    reviewsCount: 1420,
    watchlistCount: 8900
  },
  {
    id: "movie-2",
    title: "Oppenheimer",
    year: 2023,
    rating: 8.9,
    duration: "3h 00m",
    director: "Christopher Nolan",
    genres: ["Biography", "Drama", "History"],
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    aiMatch: 95,
    aiTasteTag: "High-Tension Historical Drama",
    aiInsight: "95% match: Matches your love for non-linear storytelling, intense sound design, and moral ambiguity.",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr.", "Florence Pugh"],
    reviewsCount: 2310,
    watchlistCount: 12400
  },
  {
    id: "movie-3",
    title: "Blade Runner 2049",
    year: 2017,
    rating: 8.4,
    duration: "2h 44m",
    director: "Denis Villeneuve",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    poster: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    synopsis: "Young Blade Runner K's discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who's been missing for thirty years.",
    aiMatch: 96,
    aiTasteTag: "Atmospheric Neon Cyberpunk",
    aiInsight: "96% match: Fits your mood preference for melancholic neo-noir aesthetic and Roger Deakins cinematography.",
    cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Sylvia Hoeks", "Robin Wright"],
    reviewsCount: 1890,
    watchlistCount: 9500
  },
  {
    id: "movie-4",
    title: "Interstellar",
    year: 2014,
    rating: 8.7,
    duration: "2h 49m",
    director: "Christopher Nolan",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop",
    synopsis: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    aiMatch: 94,
    aiTasteTag: "Cosmic Emotional Odyssey",
    aiInsight: "94% match: Resonates with your appreciation for physics-defying visual execution mixed with familial emotion.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    reviewsCount: 3400,
    watchlistCount: 15600
  },
  {
    id: "movie-5",
    title: "Everything Everywhere All at Once",
    year: 2022,
    rating: 8.8,
    duration: "2h 19m",
    director: "Daniel Kwan, Daniel Scheinert",
    genres: ["Action", "Adventure", "Comedy"],
    poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1600&auto=format&fit=crop",
    synopsis: "A middle-aged Chinese immigrant is swept up into an insane adventure in which she alone can save existence by exploring other universes and connecting with the lives she could have led.",
    aiMatch: 92,
    aiTasteTag: "Existential Multiverse Chaos",
    aiInsight: "92% match: High kinetic energy, inventive visuals, and emotional mother-daughter core.",
    cast: ["Michelle Yeoh", "Stephanie Hsu", "Ke Huy Quan", "Jamie Lee Curtis"],
    reviewsCount: 1650,
    watchlistCount: 7800
  },
  {
    id: "movie-6",
    title: "The Batman",
    year: 2022,
    rating: 7.8,
    duration: "2h 56m",
    director: "Matt Reeves",
    genres: ["Action", "Crime", "Drama"],
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1600&auto=format&fit=crop",
    synopsis: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    aiMatch: 90,
    aiTasteTag: "Gritty Detective Neo-Noir",
    aiInsight: "90% match: Heavy noir ambiance, Nirvana soundtrack integration, and methodical mystery.",
    cast: ["Robert Pattinson", "Zoë Kravitz", "Paul Dano", "Colin Farrell"],
    reviewsCount: 1980,
    watchlistCount: 8200
  }
];

export const MOCK_REVIEWS = [
  {
    id: "rev-1",
    movieId: "movie-1",
    movieTitle: "Dune: Part Two",
    user: {
      id: "u-101",
      username: "alex_cinephile",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      badge: "Top Critic"
    },
    rating: 9.5,
    content: "Villeneuve has delivered a sci-fi masterpiece for the ages. The scale is incomprehensible yet every character beat lands with precision. Greig Fraser's cinematography on Giedi Prime in monochrome infrared is pure cinematic poetry.",
    date: "2 days ago",
    likesCount: 142,
    hasSpoiler: false,
    aiSentiment: "Overwhelmingly Positive"
  },
  {
    id: "rev-2",
    movieId: "movie-3",
    movieTitle: "Blade Runner 2049",
    user: {
      id: "u-102",
      username: "cyber_sarah",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
      badge: "AI Taste Curator"
    },
    rating: 9.0,
    content: "A rare sequel that elevates its predecessor. The silence, the orange dust storms, and Ryan Gosling's quiet isolation build an unbearable tension. It questions humanity in a way very few sci-fi films dare to.",
    date: "5 days ago",
    likesCount: 98,
    hasSpoiler: false,
    aiSentiment: "Visually Transcendent"
  },
  {
    id: "rev-3",
    movieId: "movie-2",
    movieTitle: "Oppenheimer",
    user: {
      id: "u-103",
      username: "marcus_v",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      badge: "Verified Reviewer"
    },
    rating: 8.8,
    content: "Cillian Murphy's eyes carry the entire weight of human destruction. The sound design during Trinity test is a masterclass in tension manipulation.",
    date: "1 week ago",
    likesCount: 76,
    hasSpoiler: true,
    aiSentiment: "Intense Psychological Drama"
  }
];

export const MOCK_WATCHLISTS = [
  {
    id: "list-1",
    title: "Mind-Bending Neo-Noir & Cyberpunk",
    description: "Atmospheric, rain-slicked streets, moral grey zones, and dystopian soundscapes.",
    movieCount: 12,
    curator: {
      username: "alex_cinephile",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    movies: [MOCK_MOVIES[2], MOCK_MOVIES[0], MOCK_MOVIES[5]],
    likes: 420,
    isPrivate: false,
    coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "list-2",
    title: "Nolan Cinematic Physics & Time Twist",
    description: "Non-linear timelines, auditory precision, and existential scale.",
    movieCount: 8,
    curator: {
      username: "alex_cinephile",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    movies: [MOCK_MOVIES[1], MOCK_MOVIES[3]],
    likes: 680,
    isPrivate: false,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "list-3",
    title: "Late Night Philosophical Comfort",
    description: "Deep atmospheric cinema for quiet 2 AM reflections.",
    movieCount: 15,
    curator: {
      username: "cyber_sarah",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
    },
    movies: [MOCK_MOVIES[4], MOCK_MOVIES[2]],
    likes: 310,
    isPrivate: false,
    coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
  }
];

export const MOCK_CURRENT_USER = {
  id: "u-curr",
  username: "neo_director",
  name: "Julian Vance",
  email: "julian@cinevault.ai",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
  bio: "Exploring high-concept sci-fi, auteur direction, and synth soundscapes. CineVault member since 2024.",
  followersCount: 384,
  followingCount: 192,
  reviewsCount: 48,
  watchlistsCount: 6,
  aiTasteProfile: {
    archetype: "Cosmic Neo-Noir Visionary",
    topGenres: [
      { name: "Sci-Fi", score: 94 },
      { name: "Psychological Thriller", score: 88 },
      { name: "Auteur Drama", score: 79 },
      { name: "Neo-Noir", score: 75 }
    ],
    favoriteDirectors: ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "Ridley Scott"],
    aiSummary: "Your cinema DNA favors meticulous visual scale, brooding electronic scores, and moral ambiguity over straightforward happy endings.",
    recommendedMood: "Dark rain-slicked mysteries with synth scores"
  }
};

export const MOCK_FEED = [
  {
    id: "feed-1",
    type: "review",
    user: {
      username: "alex_cinephile",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    movie: MOCK_MOVIES[0],
    rating: 9.5,
    text: "Villeneuve has delivered a sci-fi masterpiece for the ages. The scale is incomprehensible yet every character beat lands.",
    timestamp: "2 hours ago"
  },
  {
    id: "feed-2",
    type: "watchlist_created",
    user: {
      username: "cyber_sarah",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
    },
    watchlist: MOCK_WATCHLISTS[2],
    timestamp: "5 hours ago"
  },
  {
    id: "feed-3",
    type: "follow",
    user: {
      username: "marcus_v",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    targetUser: "alex_cinephile",
    timestamp: "1 day ago"
  }
];

export const MOOD_TAGS = [
  "Cyberpunk Rain & Neon",
  "Mind-Bending Plot Twists",
  "Cosmic Existential Dread",
  "Melancholic Midnight Drama",
  "Adrenaline High-Stakes Thriller",
  "Auteur Visual Masterpiece"
];
