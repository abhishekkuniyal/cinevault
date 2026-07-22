import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, Sparkles, TrendingUp, Star, ArrowRight, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import ReviewCard from '../components/ReviewCard';
import MoodSearchBar from '../components/MoodSearchBar';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { MOCK_REVIEWS } from '../data/mockData';

export default function Home() {
  const { openAuthModal } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [moviesRes, reviewsRes] = await Promise.all([
          fetch('/api/movies'),
          fetch('/api/review/recent')
        ]);

        if (moviesRes.ok) {
          const data = await moviesRes.json();
          setMovies(data.movies || []);
        }

        if (reviewsRes.ok) {
          const data = await reviewsRes.json();
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews);
          } else {
            setReviews(MOCK_REVIEWS);
          }
        } else {
          setReviews(MOCK_REVIEWS);
        }
      } catch (err) {
        console.error(err);
        setReviews(MOCK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 sm:pt-24 pb-12 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 text-center space-y-6 relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shadow-xl"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-400 animate-spin-slow" />
            <span>Next-Gen AI Media Review Platform</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight"
          >
            Discover Cinema Through{' '}
            <span className="text-white">
              AI Taste Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Write insightful reviews, build curated bento watchlists, and unlock personalized AI taste profiles based on your mood and cinematic DNA.
          </motion.p>

          {/* AI Mood Search Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <MoodSearchBar />
          </motion.div>

        </div>
      </section>

      {/* TRENDING BENTO GRID SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-400" /> Curated Bento Collection
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Trending Cinema
            </h2>
          </div>

          <Link
            to="/browse"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            View All Movies <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">Loading trending movies...</div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MovieCard movie={movies[0]} featured={true} />
            {movies.slice(1, 5).map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
            No trending movies found. Search or browse to discover films!
          </div>
        )}
      </section>

      {/* AI TASTE ARCHETYPE HIGHLIGHT SECTION (Aceternity SaaS feature showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bento-card rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-slate-900 border border-slate-800">
          
          {/* Background Ambient Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-slate-800/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                <Zap className="w-3.5 h-3.5 text-slate-400" /> AI Taste Radar Technology
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Your Movie Reviews Create an Evolving Taste Archetype
              </h2>

              <p className="text-sm text-slate-400 leading-relaxed">
                Unlike simple average stars, CineVault's AI analyzes narrative themes, directorial preferences, and emotional resonance to construct your personal film archetype.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Mood-Based Dynamic Match</h4>
                    <p className="text-xs text-slate-400">Get match scores adjusted to whether you want rain-slicked neo-noir or upbeat high fantasy.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Connect with Cinematic Kin</h4>
                    <p className="text-xs text-slate-400">Follow users who share your exact visual and thematic taste DNA.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Preview Mockup Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400 uppercase">AI Archetype Sample</span>
                <span className="text-xs font-mono text-slate-300 font-bold">Cosmic Neo-Noir Visionary</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Sci-Fi & Cyberpunk Scale</span>
                    <span className="font-mono text-slate-400">94%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[94%] bg-amber-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Moral Ambiguity & Non-linear Plot</span>
                    <span className="font-mono text-slate-400">88%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[88%] bg-amber-500 rounded-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Electronic Soundscapes & Visual Poetry</span>
                    <span className="font-mono text-slate-400">79%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full w-[79%] bg-amber-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 font-mono">
                "AI Recommendation: Highly compatible with Villeneuve, Nolan, and Ridley Scott."
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RECENT COMMUNITY REVIEWS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400" /> Community Insights
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Recent Public Reviews
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
            No public reviews published yet. Be the first to write a review!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id || review._id} review={review} />
            ))}
          </div>
        )}
      </section>

      {/* SIGN UP CTA BANNER (Only shown when not logged in) */}
      {!isAuthenticated && (
        <section className="max-w-5xl mx-auto px-4">
          <div className="bento-card rounded-3xl p-8 sm:p-12 text-center space-y-6 bg-slate-900 border border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
              <Film className="w-6 h-6 text-slate-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Build Your Cinematic Vault?
            </h2>

            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              Join CineVault today to rate movies, publish reviews, create shareable watchlists, and unlock your personal AI taste engine.
            </p>

            <button
              onClick={() => openAuthModal('join CineVault and save your taste profile')}
              className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

    </div>
  );
}
