import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';

const getInitialTheme = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cinevault_theme');
    if (saved) return saved;
  }
  return 'dark';
};

const initialTheme = getInitialTheme();
if (typeof document !== 'undefined') {
  if (initialTheme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
}

export const useUIStore = create((set, get) => ({
  theme: initialTheme,
  authModalOpen: false,
  authModalReason: 'perform this action',
  writeReviewModalOpen: false,
  selectedMovieForReview: null,
  createListModalOpen: false,
  addToListModalOpen: false,
  selectedMovieForList: null,

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof document !== 'undefined') {
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cinevault_theme', nextTheme);
      } catch {}
    }
    set({ theme: nextTheme });
  },

  openAuthModal: (reason = 'perform this action') => {
    set({ authModalOpen: true, authModalReason: reason });
  },

  closeAuthModal: () => {
    set({ authModalOpen: false });
  },

  openWriteReviewModal: (movie = null) => {
    set({ writeReviewModalOpen: true, selectedMovieForReview: movie });
  },

  closeWriteReviewModal: () => {
    set({ writeReviewModalOpen: false, selectedMovieForReview: null });
  },

  openCreateListModal: () => {
    set({ createListModalOpen: true });
  },

  closeCreateListModal: () => {
    set({ createListModalOpen: false });
  },

  openAddToListModal: (movie) => {
    set({ addToListModalOpen: true, selectedMovieForList: movie });
  },

  closeAddToListModal: () => {
    set({ addToListModalOpen: false, selectedMovieForList: null });
  },

  // Gated action wrapper
  executeGatedAction: (callback, reason = 'access this feature') => {
    const isAuth = useAuthStore.getState().isAuthenticated;
    if (isAuth) {
      callback();
    } else {
      get().openAuthModal(reason);
    }
  }
}));
