import React, { useState, useEffect } from 'react';
import { Plus, Lock, Globe, Bookmark } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { getApiUrl } from '../utils/api';

export default function MyLists() {
  const { userWatchlists: localWatchlists } = useAuthStore();
  const { openCreateListModal } = useUIStore();
  const [userWatchlists, setUserWatchlists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await fetch(getApiUrl('/api/lists/my-lists'), { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.lists && data.lists.length > 0) {
            // Map backend data to the shape the UI expects
            setUserWatchlists(data.lists.map(l => ({
              id: l._id || l.id,
              title: l.name || l.title,
              description: l.description || '',
              isPrivate: !l.isPublic,
              movieCount: l.movies ? l.movies.length : 0,
              movies: (l.movies || []).map(m => ({
                id: m._id || m.id,
                title: m.title,
                poster: m.posterUrl || m.poster,
              })),
              likes: l.likes || 0,
            })));
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch watchlists:', err);
      }
      // Fallback to local Zustand store
      setUserWatchlists(localWatchlists);
    };
    fetchLists();
  }, [localWatchlists]);

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-slate-400" /> Watchlist Curation
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
            My Curated Watchlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build bento-styled movie collections and share them with the cinephile community.
          </p>
        </div>

        <button
          onClick={openCreateListModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Watchlist
        </button>
      </div>

      {/* Bento Grid of Watchlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userWatchlists.map((list) => (
          <div
            key={list.id}
            className="bento-card rounded-2xl p-6 flex flex-col justify-between space-y-4 group hover:border-amber-500/50"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                  {list.isPrivate ? <Lock className="w-3 h-3 text-slate-400" /> : <Globe className="w-3 h-3 text-slate-400" />}
                  {list.isPrivate ? 'Private' : 'Public'}
                </span>

                <span className="text-xs font-mono text-slate-400">{list.movieCount || 0} Films</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                {list.title}
              </h3>

              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {list.description}
              </p>
            </div>

            {/* Movie Preview Posters Stack */}
            {list.movies && list.movies.length > 0 && (
              <div className="flex items-center -space-x-3 overflow-hidden py-2">
                {list.movies.map((m) => (
                  <img
                    key={m.id}
                    src={m.poster}
                    alt={m.title}
                    className="w-10 h-14 rounded-md object-cover ring-2 ring-slate-950 shadow-md"
                  />
                ))}
              </div>
            )}

            {/* Footer info */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>{list.likes || 0} Likes</span>
              <span className="text-amber-400 hover:underline cursor-pointer">Manage List</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
