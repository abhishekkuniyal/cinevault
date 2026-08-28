import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, SlidersHorizontal, Grid, List } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import MoodSearchBar from '../components/MoodSearchBar';
import { getApiUrl } from '../utils/api';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const moodQuery = searchParams.get('mood') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('aiMatch'); // 'aiMatch' | 'rating' | 'year'

  const genres = ['All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'];
  
  const [moviesData, setMoviesData] = useState([]);
  const [aiInterpreted, setAiInterpreted] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      if (moodQuery) {
        try {
          const res = await fetch(getApiUrl('/api/ai/mood-search'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: moodQuery })
          });
          if (res.ok) {
            const data = await res.json();
            setMoviesData(data.movies || []);
            setAiInterpreted(data.interpreted || null);
          } else {
            setMoviesData([]);
          }
        } catch (err) {
          console.error(err);
          setMoviesData([]);
        } finally {
          setLoading(false);
        }
      } else if (selectedGenre !== 'All') {
        setAiInterpreted(null);
        try {
          const res = await fetch(getApiUrl(`/api/movies?search=${encodeURIComponent(selectedGenre)}`));
          if (res.ok) {
            const data = await res.json();
            setMoviesData(data.movies || []);
          } else {
            setMoviesData([]);
          }
        } catch (err) {
          console.error(err);
          setMoviesData([]);
        } finally {
          setLoading(false);
        }
      } else {
        setAiInterpreted(null);
        try {
          const res = await fetch(getApiUrl('/api/movies'));
          if (res.ok) {
            const data = await res.json();
            setMoviesData(data.movies || []);
          } else {
            setMoviesData([]);
          }
        } catch (err) {
          console.error(err);
          setMoviesData([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMovies();
  }, [moodQuery, selectedGenre]);

  const filteredMovies = moviesData.filter((movie) => {
    const title = movie.title || '';
    const synopsis = movie.synopsis || '';
    const movieGenres = movie.genres || [];

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          synopsis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || 
      movieGenres.some(g => g.toLowerCase() === selectedGenre.toLowerCase() || g.toLowerCase().includes(selectedGenre.toLowerCase()) || selectedGenre.toLowerCase().includes(g.toLowerCase()));

    return matchesSearch && matchesGenre;
  }).sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'year') return (b.year || 0) - (a.year || 0);
    return (b.aiMatch || 0) - (a.aiMatch || 0);
  });

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="space-y-4 text-center max-w-3xl mx-auto pt-6">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-slate-400" /> CineVault Vault Engine
        </span>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Browse & Mood Discovery
        </h1>
        
        <p className="text-sm text-slate-400">
          Filter through curated films using traditional categories or instant AI mood semantics.
        </p>

        {/* AI Mood Bar */}
        <MoodSearchBar
          onSearch={(query) => {
            setSelectedGenre('All');
            setSearchParams({ mood: query });
          }}
        />
      </div>

      {/* Active Mood Pill & AI Interpretation Banner */}
      {moodQuery && (
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-slate-400 animate-pulse" />
                <span className="text-slate-400">Active AI Search Mood:</span>
                <span className="font-mono text-white font-bold text-sm">"{moodQuery}"</span>
              </div>

              {aiInterpreted && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  {aiInterpreted.genres?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Detected Genres:</span>
                      {aiInterpreted.genres.map(g => (
                        <span key={g} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">{g}</span>
                      ))}
                    </div>
                  )}
                  {aiInterpreted.keywords?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Mood Keywords:</span>
                      {aiInterpreted.keywords.map(k => (
                        <span key={k} className="px-2 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/30 text-amber-300 font-mono">#{k}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setSearchParams({})}
              className="text-slate-400 hover:text-white font-semibold underline shrink-0 cursor-pointer"
            >
              Clear AI Search
            </button>
          </div>
        </div>
      )}

      {/* Filter Matrix Toolbar */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        
        {/* Search Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchTerm.trim()) {
              setSelectedGenre('All');
              setSearchParams({ mood: searchTerm });
            }
          }}
          className="relative w-full md:w-80 flex items-center gap-1"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or mood..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Search
          </button>
        </form>


        {/* Genre Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedGenre === g
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="aiMatch">Sort by AI Match</option>
            <option value="rating">Sort by Rating</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>

      </div>

      {/* Movie Results Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="bento-card rounded-3xl p-16 text-center text-slate-400 space-y-4 bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-300">
              Analyzing cinematic mood & fetching matching films...
            </p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="bento-card rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <p className="text-base text-slate-300">No movies match your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGenre('All');
                setSearchParams({});
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
