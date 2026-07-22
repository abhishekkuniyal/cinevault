import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Sparkles, LogOut, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { Avatar } from './Avatar';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, toggleTheme, openAuthModal, executeGatedAction } = useUIStore();


  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Browse', path: '/browse' },
    { label: 'Watchlists', path: '/lists', gated: true, reason: 'view your watchlists' },
    { label: 'Activity Feed', path: '/feed' },
  ];

  const handleNavClick = (e, item) => {
    if (item.gated && !isAuthenticated) {
      e.preventDefault();
      executeGatedAction(() => navigate(item.path), item.reason);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:bg-amber-400 group-hover:scale-105 transition-all">
            <Film className="w-5 h-5 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight brand-logo-text">
              CineVault
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-semibold -mt-1 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> AI Cinephile
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-800/80 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
                {item.gated && !isAuthenticated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" title="Login Required" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700 cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Auth Button or User Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-900/80 border border-amber-500/30 hover:border-amber-500/60 transition-all"
              >
                <Avatar 
                  name={user?.name}
                  className="w-7 h-7 ring-2 ring-amber-500/40" 
                />
                <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user?.name}</span>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('log in to your account')}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => openAuthModal('create an account')}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
