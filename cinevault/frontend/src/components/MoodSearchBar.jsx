import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOOD_TAGS } from '../data/mockData';

export default function MoodSearchBar({ onSearch = null }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/browse?mood=${encodeURIComponent(query)}`);
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
    if (onSearch) {
      onSearch(tag);
    } else {
      navigate(`/browse?mood=${encodeURIComponent(tag)}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl shadow-black/20 focus-within:border-amber-500 transition-all"
      >
        <div className="pl-3 sm:pl-4 text-amber-400">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your mood... e.g. 'Mind-bending sci-fi with synth soundtrack for rainy night'"
          className="w-full px-3 py-3 bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:outline-none"
        />

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
        >
          <span>AI Search</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Suggested Mood Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
          <Compass className="w-3 h-3 text-slate-400" /> Try:
        </span>
        {MOOD_TAGS.slice(0, 4).map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 text-[11px] font-mono text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
