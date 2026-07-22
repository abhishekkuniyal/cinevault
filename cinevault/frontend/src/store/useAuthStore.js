import { create } from 'zustand';

const getStoredUser = () => {
  try {
    const item = localStorage.getItem('cinevault_user');
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

const initialUser = getStoredUser();


export const useAuthStore = create((set, get) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,
  userReviews: [],
  userWatchlists: [],
  followingUsers: new Set(),

  checkAuth: async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const u = data.user;
        const fullUser = {
          id: u._id || u.id,
          _id: u._id || u.id,
          username: u.username,
          name: u.name || u.username,
          email: u.email,
          bio: u.bio || 'Avid film review writer & cinephile curator.',
          avatarUrl: u.avatarUrl || '',
          followersCount: u.followersCount || 0,
          followingCount: u.followingCount || 0,
        };
        set({ user: fullUser, isAuthenticated: true });
        localStorage.setItem('cinevault_user', JSON.stringify(fullUser));
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('cinevault_user');
        set({ user: null, isAuthenticated: false });
      }
    } catch (e) {
      console.error('checkAuth network notice:', e.message);
    }
  },

  register: async (credentials) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message || 'Registration successful! Please log in.', user: data.user };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (e) {
      return { success: false, message: e.message || 'Network connection failed' };
    }
  },

  // Log in with user details
  login: async (credentials) => {
    if (!credentials || !credentials.email || !credentials.password) {
      return { success: false, message: "Please enter your email and password." };
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (res.ok) {
        const u = data.user;
        const fullUser = {
          id: u._id || u.id,
          _id: u._id || u.id,
          username: u.username,
          name: u.name || u.username,
          email: u.email,
          bio: u.bio || 'Avid film review writer & cinephile curator.',
          avatarUrl: u.avatarUrl || '',
          followersCount: u.followersCount || 0,
          followingCount: u.followingCount || 0,
        };
        set({ user: fullUser, isAuthenticated: true });
        localStorage.setItem('cinevault_user', JSON.stringify(fullUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (e) {
      return { success: false, message: e.message || 'Network connection failed' };
    }
  },

  // Log out

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (e) { console.error(e); }
    localStorage.removeItem('cinevault_user');
    set({
      user: null,
      isAuthenticated: false
    });
  },


  // Follow/unfollow user
  toggleFollow: async (userId) => {
    const current = new Set(get().followingUsers);
    const isFollowing = current.has(userId);
    
    try {
      if (isFollowing) {
        await fetch(`/api/users/${userId}/unfollow`, { method: 'DELETE', credentials: 'include' });
        current.delete(userId);
      } else {
        await fetch(`/api/users/${userId}/follow`, { method: 'POST', credentials: 'include' });
        current.add(userId);
      }
    } catch (e) {
      console.error('Follow toggle failed', e);
      // Optimistic/fallback update
      if (isFollowing) current.delete(userId);
      else current.add(userId);
    }
    set({ followingUsers: current });
  },

  // Add review
  addReview: (review) => {
    const user = get().user;
    const newReview = {
      id: `rev-${Date.now()}`,
      user: user ? { username: user.username, name: user.name || user.username } : { username: 'cinephile', name: 'CineVault Member' },
      date: 'Just now',
      likesCount: 0,
      hasSpoiler: false,
      aiSentiment: 'Positive',
      ...review
    };
    set((state) => ({
      userReviews: [newReview, ...state.userReviews]
    }));
  },

  // Add watchlist
  createWatchlist: (listData) => {
    const user = get().user;
    const newList = {
      id: `list-${Date.now()}`,
      curator: user ? { username: user.username, name: user.name || user.username } : { username: 'cinephile', name: 'CineVault Member' },
      movieCount: listData.movies ? listData.movies.length : 0,
      likes: 0,
      isPrivate: false,
      coverImage: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
      ...listData
    };
    set((state) => ({
      userWatchlists: [newList, ...state.userWatchlists]
    }));
  }
}));
