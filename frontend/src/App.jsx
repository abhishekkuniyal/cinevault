import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Modals
import AuthModal from './components/AuthModal';
import WriteReviewModal from './components/WriteReviewModal';
import CreateListModal from './components/CreateListModal';
import AddToListModal from './components/AddToListModal';

// Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import MovieDetail from './pages/MovieDetail';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import MyLists from './pages/MyLists';
import Feed from './pages/Feed';

import { useAuthStore } from './store/useAuthStore';
import { useUIStore } from './store/useUIStore';

// Action-Gated Route Wrapper
function GatedRoute({ children, reason = 'access this page' }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal(reason);
    }
  }, [isAuthenticated, openAuthModal, reason]);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Scroll to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 bg-grid-pattern selection:bg-amber-500 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/user/:username" element={<Profile />} />

            {/* Gated Routes */}
            <Route
              path="/profile"
              element={
                <GatedRoute reason="view your personal dashboard">
                  <Profile />
                </GatedRoute>
              }
            />
            <Route
              path="/lists"
              element={
                <GatedRoute reason="view and edit your watchlists">
                  <MyLists />
                </GatedRoute>
              }
            />
            <Route path="/feed" element={<Feed />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Action-Gating Modals */}
        <AuthModal />
        <WriteReviewModal />
        <CreateListModal />
        <AddToListModal />

      </div>
    </Router>
  );
}
