import React, { useState, useEffect } from 'react';
import { Rss, Star, List, UserPlus, Sparkles, Film, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';
import { MOCK_FEED } from '../data/mockData';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { getApiUrl } from '../utils/api';

export default function Feed() {
  const { isAuthenticated } = useAuthStore();
  const { openAuthModal } = useUIStore();

  const [filter, setFilter] = useState('all'); // 'all' | 'reviews' | 'lists'
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feedUrl = isAuthenticated ? getApiUrl('/api/feed') : getApiUrl('/api/feed/public');
        const res = await fetch(feedUrl, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.activities && data.activities.length > 0) {
            setFeedData(data.activities);
          } else {
            setFeedData(MOCK_FEED);
          }
        } else {
          setFeedData(MOCK_FEED);
        }
      } catch (err) {
        console.error(err);
        setFeedData(MOCK_FEED);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [isAuthenticated]);

  const filteredFeed = feedData.filter((item) => {
    if (filter === 'reviews') return item.type === 'review';
    if (filter === 'lists') return item.type === 'watchlist_created';
    return true;
  });

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4">
      
      {/* Header */}
      <div className="pt-6 space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Rss className="w-4 h-4 text-slate-400" /> Cinephile Feed
        </span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Social Activity Feed
        </h1>
        <p className="text-xs text-slate-400">
          Real-time stream of reviews, watchlists, and follows from the CineVault community.
        </p>
      </div>

      {/* Create Account Banner when user is not logged in */}
      {!isAuthenticated && (
        <div className="bento-card rounded-3xl p-8 sm:p-10 text-center space-y-5 bg-slate-900 border border-slate-800 shadow-2xl shadow-amber-500/10">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto">
            <Film className="w-6 h-6 text-slate-300" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to Build Your Cinematic Vault?
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Join CineVault today to rate movies, publish reviews, create shareable watchlists, and unlock your personal AI taste engine.
          </p>

          <button
            onClick={() => openAuthModal('create an account to join CineVault')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-medium">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Activity
        </button>
        <button
          onClick={() => setFilter('reviews')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'reviews' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Reviews Only
        </button>
        <button
          onClick={() => setFilter('lists')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filter === 'lists' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Watchlists Only
        </button>
      </div>

      {/* Feed Stream */}
      {loading ? (
        <div className="space-y-4 py-12 text-center text-slate-500 text-sm">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p>Loading cinephile activity...</p>
        </div>
      ) : filteredFeed.length === 0 ? (
        <div className="bento-card rounded-2xl p-12 text-center space-y-4 max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-between mx-auto p-3 text-slate-400">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-white">No Activity Found</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            There are no activity updates for this filter yet. Try exploring community members or posting your first review!
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            Explore Movies
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredFeed.map((item) => {
            const userName = item.user?.name || item.user?.username || 'Cinephile';
            
            if (item.type === 'review') {
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pl-1">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-semibold text-slate-200">{userName}</span> posted a review • {item.timestamp}
                  </div>
                  <ReviewCard
                    review={{
                      id: item.id,
                      movieId: item.movie?.id || item.movie,
                      movieTitle: item.movie?.title || 'Film Review',
                      user: item.user,
                      rating: item.rating || 5,
                      content: item.text,
                      date: item.timestamp,
                      likesCount: 24,
                      hasSpoiler: false,
                      aiSentiment: 'High Recommendation'
                    }}
                  />
                </div>
              );
            }

            if (item.type === 'watchlist_created') {
              return (
                <div key={item.id} className="bento-card rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <List className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-slate-200">{userName}</span> created a new watchlist • {item.timestamp}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <h3 className="text-base font-bold text-white">{item.watchlist?.title || item.watchlist?.name || 'New Watchlist'}</h3>
                    {item.watchlist?.description && (
                      <p className="text-xs text-slate-400">{item.watchlist.description}</p>
                    )}
                  </div>
                </div>
              );
            }

            if (item.type === 'follow') {
              return (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span><strong>{userName}</strong> started following <strong>@{typeof item.targetUser === 'string' ? item.targetUser : item.targetUser?.username || 'user'}</strong></span>
                  </div>
                  <span className="text-slate-500 font-mono">{item.timestamp}</span>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

    </div>
  );
}
