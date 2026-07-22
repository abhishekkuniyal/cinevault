import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bookmark, Plus, Check } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';

export default function AddToListModal() {
  const { addToListModalOpen, selectedMovieForList, closeAddToListModal } = useUIStore();
  const { userWatchlists } = useAuthStore();

  const [addedLists, setAddedLists] = useState(new Set());

  if (!addToListModalOpen) return null;

  const toggleAdd = (listId) => {
    const next = new Set(addedLists);
    if (next.has(listId)) {
      next.delete(listId);
    } else {
      next.add(listId);
    }
    setAddedLists(next);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAddToListModal}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-amber-500/10 overflow-hidden"
        >
          <button
            onClick={closeAddToListModal}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-5">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1 uppercase tracking-wider mb-1">
              <Bookmark className="w-3.5 h-3.5" /> Save Movie
            </span>
            <h3 className="text-lg font-bold text-white">
              Add "{selectedMovieForList?.title}" to Watchlist
            </h3>
          </div>

          <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
            {userWatchlists.map((list) => {
              const isAdded = addedLists.has(list.id);
              return (
                <div
                  key={list.id}
                  onClick={() => toggleAdd(list.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isAdded
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-semibold">{list.title}</h4>
                    <span className="text-[11px] text-slate-500 font-mono">{list.movieCount} movies</span>
                  </div>

                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isAdded ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold' : 'border-slate-700 text-slate-500'
                  }`}>
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={closeAddToListModal}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
