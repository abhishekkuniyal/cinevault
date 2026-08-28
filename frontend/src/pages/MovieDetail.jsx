import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Star, Sparkles, Edit3, Bookmark, ArrowLeft } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import ReviewCard from '../components/ReviewCard';
import { MOCK_REVIEWS } from '../data/mockData';
import { getApiUrl } from '../utils/api';

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { executeGatedAction, openWriteReviewModal, openAddToListModal } = useUIStore();

  const [movie, setMovie] = React.useState(null);
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const res = await fetch(getApiUrl(`/api/movies/${id}`));
        if (res.ok) {
          const data = await res.json();
          setMovie(data.movie);
        } else {
          setMovie(null);
        }
      } catch (err) {
        setMovie(null);
      } finally {
        setLoading(false);
      }

      try {
        const reviewRes = await fetch(getApiUrl(`/api/review/getReview/${id}`));
        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          if (reviewData.reviews && reviewData.reviews.length > 0) {
            setReviews(reviewData.reviews);
          } else {
            const matchingMock = MOCK_REVIEWS.filter(r => r.movieId === id || r.movieId === 'movie-1');
            setReviews(matchingMock.length > 0 ? matchingMock : MOCK_REVIEWS.slice(0, 2));
          }
        } else {
          setReviews(MOCK_REVIEWS.slice(0, 2));
        }
      } catch (err) {
        setReviews(MOCK_REVIEWS.slice(0, 2));
      }
    };
    fetchMovieData();
  }, [id]);

  if (!movie) return <div className="p-8 text-white text-center">Loading movie...</div>;

  const handleWriteReview = () => {
    executeGatedAction(() => {
      openWriteReviewModal(movie);
    }, `write a review for "${movie.title}"`);
  };

  const handleAddToList = () => {
    executeGatedAction(() => {
      openAddToListModal(movie);
    }, `add "${movie.title}" to your watchlist`);
  };

  const handleRate = () => {
    executeGatedAction(() => {
      openWriteReviewModal(movie);
    }, `rate "${movie.title}"`);
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* Top Backdrop Hero */}
      <div className="relative w-full h-[380px] sm:h-[480px] overflow-hidden rounded-3xl border border-slate-800">
        <img
          src={movie.backdrop || movie.backdropUrl || movie.poster || movie.posterUrl || "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop"}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop";
          }}
          className="w-full h-full object-cover filter brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-700 backdrop-blur-md text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Hero Overlay Content */}
        <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <img
              src={movie.poster || movie.posterUrl || movie.backdrop || movie.backdropUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
              }}
              className="w-28 sm:w-40 rounded-xl shadow-2xl border border-slate-700/80 hidden sm:block object-cover"
            />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <span>{movie.genres?.join(', ') || 'Film'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-400">Directed by <strong className="text-slate-200">{movie.director}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleWriteReview}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Write Review
            </button>

            <button
              onClick={handleAddToList}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Bookmark className="w-4 h-4" /> Save to Watchlist
            </button>

            <button
              onClick={handleRate}
              className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Star className="w-4 h-4 text-slate-400" /> Rate
            </button>
          </div>
        </div>
      </div>

      {/* Grid Specs & AI Analysis */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Left Column (Overview & Cast) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Synopsis */}
          <div className="bento-card rounded-2xl p-6 space-y-3">
            <h3 className="text-lg font-bold text-white">Story & Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {movie.synopsis}
            </p>
          </div>

          {/* Cast Members */}
          <div className="bento-card rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Featured Cast</h3>
            <div className="flex flex-wrap gap-2">
              {(movie.cast || []).map((actor) => (
                <span
                  key={actor}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>

          {/* Public Reviews List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Public Reviews ({reviews.length})</h3>
              <button
                onClick={handleWriteReview}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
              >
                + Add Your Review
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : (
              <div className="bento-card rounded-2xl p-8 text-center text-slate-400 space-y-3">
                <p className="text-sm">No public reviews written for this film yet.</p>
                <button
                  onClick={handleWriteReview}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
                >
                  Be the First to Review
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Sidebar (AI Taste Insights & Metrics) */}
        <div className="space-y-6">
          
          {/* AI Taste Card */}
          <div className="bento-card rounded-2xl p-6 space-y-4 bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Taste Breakdown
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-medium">Your Taste Compatibility</span>
                <span className="text-sm font-mono font-bold text-slate-300">{movie.aiMatch}% Match</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${movie.aiMatch}%` }} />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              "{movie.aiInsight}"
            </p>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Overall Average</span>
              <span className="font-bold text-slate-300 font-mono flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-slate-400" /> {movie.rating} / 10
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
