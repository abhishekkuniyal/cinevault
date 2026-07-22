import React from 'react';
import { Film, Sparkles, Heart, Globe, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GithubIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 border border-amber-400 flex items-center justify-center">
                <Film className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-extrabold text-lg brand-logo-text">
                CineVault
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-driven taste analysis, mood recommendation engines, and social cinephile watchlists built for modern film lovers.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
              <Sparkles className="w-3 h-3 text-amber-400" /> AI Engine Online
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Discovery</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/browse" className="hover:text-amber-400 transition-colors">Trending Movies</Link></li>
              <li><Link to="/browse" className="hover:text-amber-400 transition-colors">Mood Recommendations</Link></li>
              <li><Link to="/lists" className="hover:text-amber-400 transition-colors">Curated Watchlists</Link></li>
              <li><Link to="/feed" className="hover:text-amber-400 transition-colors">Community Feed</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Connect</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a 
                  href="https://github.com/abhishekkuniyal" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  GitHub: @abhishekkuniyal
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Community</h4>
            <p className="text-xs text-slate-400 mb-3">
              Join thousands of film critics rating, reviewing, and discovering cinema.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Global Community">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CineVault Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for cinephiles with <Heart className="w-3 h-3 text-slate-500 fill-slate-500" /> and AI intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
