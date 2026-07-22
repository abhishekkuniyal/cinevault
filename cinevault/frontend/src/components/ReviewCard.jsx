import React, { useState } from 'react';
import { Star, ThumbsUp, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import { Avatar } from './Avatar';

export default function ReviewCard({ review }) {
  const navigate = useNavigate();
  const { executeGatedAction } = useUIStore();
  const [likes, setLikes] = useState(review?.likesCount || 0);
  const [liked, setLiked] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(false);

  if (!review) return null;

  const reviewUser = review.user || {
    username: typeof review.userId === 'object' ? (review.userId?.username || 'cinephile') : 'cinephile',
    name: typeof review.userId === 'object' ? (review.userId?.username || 'CineVault Member') : 'CineVault Member'
  };

  const username = reviewUser.username || 'cinephile';
  const name = reviewUser.name || username;
  const contentText = review.content || review.description || review.text || review.title || '';
  const movieTitle = review.movieTitle || (typeof review.movieId === 'object' ? review.movieId?.title : null);

  const handleLike = (e) => {
    e.stopPropagation();
    executeGatedAction(() => {
      if (liked) {
        setLikes(prev => prev - 1);
        setLiked(false);
      } else {
        setLikes(prev => prev + 1);
        setLiked(true);
      }
    }, 'upvote this review');
  };

  return (
    <div className="bento-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
      
      {/* Reviewer Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/user/${username}`} className="group flex items-center gap-3">
            <Avatar 
              name={name}
              className="w-10 h-10 ring-2 ring-slate-800 group-hover:ring-amber-500 transition-all"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {name}
                </h4>
                {reviewUser.badge && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                    {reviewUser.badge}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-500 font-mono">@{username} • {review.date || 'Recently'}</span>
            </div>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-bold text-xs">
          <Star className="w-3.5 h-3.5 text-slate-400" />
          {review.rating || 5}
        </div>
      </div>

      {/* Movie Reference if specified */}
      {movieTitle && (
        <div className="text-xs text-slate-400 font-medium">
          Reviewed <Link to={`/movie/${review.movieId}`} className="text-amber-400 font-semibold hover:underline">{movieTitle}</Link>
        </div>
      )}

      {/* Review Body */}
      <div className="relative">
        {review.hasSpoiler && !showSpoiler ? (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700 flex flex-col items-center justify-center text-center space-y-2">
            <ShieldAlert className="w-5 h-5 text-slate-400" />
            <p className="text-xs text-slate-300">This review contains plot spoilers.</p>
            <button
              onClick={() => setShowSpoiler(true)}
              className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Reveal Review
            </button>
          </div>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">
            "{contentText}"
          </p>
        )}
      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {review.aiSentiment && (
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" /> {review.aiSentiment}
          </span>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              liked
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-amber-300' : ''}`} />
            <span className="font-mono text-xs">{likes}</span>
          </button>
        </div>
      </div>

    </div>
  );
}

