import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, FolderPlus, Lock, Globe } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';

export default function CreateListModal() {
  const { createListModalOpen, closeCreateListModal } = useUIStore();
  const { createWatchlist } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  if (!createListModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: title,
          isPublic: !isPrivate
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Use real DB data for local store
        createWatchlist({
          id: data.list._id || data.list.id,
          title: data.list.name || title,
          description,
          isPrivate
        });
      } else {
        console.error('Failed to create list on backend');
        // Fallback optimistic update
        createWatchlist({ title, description, isPrivate });
      }
    } catch (err) {
      console.error(err);
      // Fallback optimistic update
      createWatchlist({ title, description, isPrivate });
    }

    setTitle('');
    setDescription('');
    setIsPrivate(false);
    closeCreateListModal();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCreateListModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          <button
            onClick={closeCreateListModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 uppercase tracking-wider mb-1">
              <FolderPlus className="w-3.5 h-3.5" /> Watchlist Creator
            </span>
            <h3 className="text-xl font-bold text-white">Create New Watchlist</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Watchlist Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mind-Bending Sci-Fi & Neon Noir"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="What connects these films? (Mood, director, decade...)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                {isPrivate ? <Lock className="w-4 h-4 text-slate-400" /> : <Globe className="w-4 h-4 text-slate-400" />}
                <span>{isPrivate ? 'Private Watchlist' : 'Public Watchlist'}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Switch to {isPrivate ? 'Public' : 'Private'}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Save Watchlist
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
