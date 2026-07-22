import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Sparkles, Plus, Edit3, Bookmark, Eye } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function MovieCard({ movie, featured = false }) {
  const navigate = useNavigate();
  const { executeGatedAction, openWriteReviewModal, openAddToListModal } = useUIStore();

  const handleWriteReview = (e) => {
    e.stopPropagation();
    executeGatedAction(() => {
      openWriteReviewModal(movie);
    }, `write a review for "${movie.title}"`);
  };

  const handleAddToList = (e) => {
    e.stopPropagation();
    executeGatedAction(() => {
      openAddToListModal(movie);
    }, `add "${movie.title}" to a watchlist`);
  };

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      className={`group bento-card rounded-2xl cursor-pointer flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`}
    >
      {/* Top Image Poster Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.backdrop || movie.backdropUrl || movie.poster || movie.posterUrl || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
          alt={movie.title}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Rating */}
          <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Star className="w-3.5 h-3.5 text-slate-400" />
            {movie.rating}
          </div>

          {/* AI Match Badge */}
          {movie.aiMatch && (
            <div className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/80 backdrop-blur-md flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-300 shadow-md">
              <Sparkles className="w-3 h-3 text-slate-400" />
              {movie.aiMatch}% AI Match
            </div>
          )}
        </div>

        {/* Quick Gated Action Overlay on Hover */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
          <button
            onClick={handleWriteReview}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Write Review (Gated)"
          >
            <Edit3 className="w-3.5 h-3.5" /> Review
          </button>
          
          <button
            onClick={handleAddToList}
            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg border border-slate-600/40 transition-transform active:scale-95"
            title="Add to List (Gated)"
          >
            <Bookmark className="w-3.5 h-3.5" /> Save
          </button>

          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold shadow-lg transition-transform active:scale-95"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Card Body Info */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span>{movie.year}</span>
            <span>•</span>
            <span>{movie.duration}</span>
            {movie.genres?.[0] && (
              <>
                <span>•</span>
                <span className="text-slate-400">{movie.genres[0]}</span>
              </>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {movie.synopsis}
          </p>
        </div>

        {/* AI Taste Tag Footer */}
        {movie.aiTasteTag && (
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-slate-400" /> {movie.aiTasteTag}
            </span>
            <span className="text-slate-500 font-mono">{movie.reviewsCount} reviews</span>
          </div>
        )}
      </div>
    </div>
  );
}
