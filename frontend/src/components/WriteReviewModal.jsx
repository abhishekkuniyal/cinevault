import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';

export default function WriteReviewModal() {
  const { writeReviewModalOpen, selectedMovieForReview, closeWriteReviewModal } = useUIStore();
  const { addReview, user } = useAuthStore();

  const [rating, setRating] = useState(4);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [hasSpoiler, setHasSpoiler] = useState(false);

  if (!writeReviewModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/review/createReview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          movieId: selectedMovieForReview?.id || 'movie-1',
          rating,
          text: content,
          hasSpoiler
        })
      });

      if (res.ok) {
        await res.json();
      } else {
        console.error('Failed to create review on backend');
      }
    } catch (err) {
      console.error(err);
    }

    // fallback / optimistic update
    addReview({
      movieId: selectedMovieForReview?.id || 'movie-1',
      movieTitle: selectedMovieForReview?.title || 'Dune: Part Two',
      rating,
      content,
      hasSpoiler,
      user: {
        id: user?.id || 'u-guest',
        username: user?.username || 'cinephile',
        name: user?.name || 'CineVault User',
        badge: 'Member'
      }
    });

    setSubmitting(false);
    setContent('');
    setRating(4);
    setHasSpoiler(false);
    closeWriteReviewModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeWriteReviewModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          <button
            onClick={closeWriteReviewModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Gated Review Action
            </span>
            <h3 className="text-xl font-bold text-white">
              Review {selectedMovieForReview ? `"${selectedMovieForReview.title}"` : 'Movie'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Your Rating: <span className="text-amber-400 font-mono text-sm ml-1">{rating}/5</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Review Thought & Analysis
              </label>
              <textarea
                rows={4}
                required
                placeholder="What worked? Direction, cinematography, plot twists, soundtrack..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              />
            </div>

            {/* Spoiler Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="spoiler"
                checked={hasSpoiler}
                onChange={(e) => setHasSpoiler(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
              />
              <label htmlFor="spoiler" className="text-xs text-slate-300">
                Contains spoilers
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {submitting ? 'Publishing Review...' : 'Publish Public Review'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
