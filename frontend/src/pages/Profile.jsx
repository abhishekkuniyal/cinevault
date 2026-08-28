import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserCheck, UserPlus, Sparkles, Film, List, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import ReviewCard from '../components/ReviewCard';
import { Avatar } from '../components/Avatar';
import { getApiUrl } from '../utils/api';

export default function Profile() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated, followingUsers, toggleFollow, checkAuth } = useAuthStore();
  const { executeGatedAction } = useUIStore();

  const isOwnProfile = !username || (currentUser && username === currentUser.username);
  const [fetchedUser, setFetchedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'lists' | 'ai'
  const [userReviews, setUserReviews] = useState([]);
  const [userWatchlists, setUserWatchlists] = useState([]);

  // Fetch target user data if viewing a public profile by username
  useEffect(() => {
    const loadProfileUser = async () => {
      if (username && (!currentUser || username !== currentUser.username)) {
        setLoading(true);
        try {
          const res = await fetch(getApiUrl(`/api/auth/user/${username}`));
          if (res.ok) {
            const data = await res.json();
            setFetchedUser(data.user);
          } else {
            setFetchedUser(null);
          }
        } catch (e) {
          console.error('Error fetching public user profile:', e);
          setFetchedUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setFetchedUser(null);
      }
    };
    loadProfileUser();
  }, [username, currentUser]);

  // Construct active profile user object with safe defaults
  const activeUser = isOwnProfile
    ? (currentUser || {
        id: 'guest-id',
        username: 'cinephile',
        name: 'CineVault Member',
        email: '',
        bio: 'Avid film review writer, visual aesthetic enthusiast, and cinephile curator.',
        followersCount: 0,
        followingCount: 0,
      })
    : (fetchedUser || {
        id: 'public-id',
        username: username || 'cinephile',
        name: username || 'Cinephile',
        bio: 'Avid film review writer, visual aesthetic enthusiast, and cinephile curator.',
        followersCount: 0,
        followingCount: 0,
      });

  const isFollowing = followingUsers.has(activeUser.id || activeUser._id);

  const handleFollowClick = () => {
    executeGatedAction(() => {
      toggleFollow(activeUser.id || activeUser._id);
    }, `follow @${activeUser.username}`);
  };

  // Fetch reviews and watchlists for active profile user
  useEffect(() => {
    const fetchProfileData = async () => {
      const targetId = activeUser.id || activeUser._id;
      if (targetId && targetId !== 'guest-id' && targetId !== 'public-id') {
        try {
          const reviewRes = await fetch(getApiUrl(`/api/review/user/${targetId}`), { credentials: 'include' });
          if (reviewRes.ok) {
            const reviewData = await reviewRes.json();
            setUserReviews(reviewData.reviews || []);
          } else {
            setUserReviews([]);
          }
        } catch (err) {
          setUserReviews([]);
        }
      } else {
        setUserReviews([]);
      }

      if (isOwnProfile) {
        try {
          const listRes = await fetch(getApiUrl(`/api/lists/my-lists`), { credentials: 'include' });
          if (listRes.ok) {
            const listData = await listRes.json();
            setUserWatchlists(listData.lists || []);
          } else {
            setUserWatchlists([]);
          }
        } catch (err) {
          setUserWatchlists([]);
        }
      } else {
        setUserWatchlists([]);
      }
    };

    fetchProfileData();
  }, [activeUser.id, activeUser._id, activeUser.username, isOwnProfile]);

  // Fallback AI Taste Profile
  const aiTasteProfile = activeUser.aiTasteProfile || {
    archetype: 'Neo-Noir Aesthetician',
    aiSummary: 'Demonstrates a strong affinity for moody atmospheric thrillers, visually stunning cinematography, and complex character-driven narratives.',
    topGenres: [
      { name: 'Sci-Fi & Cyberpunk', score: 92 },
      { name: 'Psychological Thriller', score: 88 },
      { name: 'Neo-Noir', score: 84 },
      { name: 'Indie Drama', score: 79 }
    ]
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      
      {/* Header Profile Card */}
      <div className="bento-card rounded-3xl p-6 sm:p-10 relative overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Avatar 
              name={activeUser.name || activeUser.username}
              className="w-24 h-24 sm:w-28 sm:h-28 text-4xl ring-4 ring-amber-500/30 shadow-2xl shrink-0" 
            />
            
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {activeUser.name || activeUser.username}
                </h1>
                {isOwnProfile && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono text-amber-300 font-semibold">
                    Your Profile
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">@{activeUser.username}</p>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                {activeUser.bio || 'Avid film review writer, visual aesthetic enthusiast, and cinephile curator.'}
              </p>

              {/* Counts Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-6 pt-2 text-xs font-mono">
                <div>
                  <span className="font-bold text-white text-sm">{userReviews.length || activeUser.reviewsCount || 0}</span>{' '}
                  <span className="text-slate-400">Reviews</span>
                </div>
                <div>
                  <span className="font-bold text-white text-sm">{activeUser.followersCount || 0}</span>{' '}
                  <span className="text-slate-400">Followers</span>
                </div>
                <div>
                  <span className="font-bold text-white text-sm">{activeUser.followingCount || 0}</span>{' '}
                  <span className="text-slate-400">Following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            {!isOwnProfile ? (
              <button
                onClick={handleFollowClick}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                  isFollowing
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-slate-200'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/20'
                }`}
              >
                {isFollowing ? <UserCheck className="w-4 h-4 text-slate-400" /> : <UserPlus className="w-4 h-4" />}
                {isFollowing ? 'Following' : 'Follow User'}
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Authenticated Member
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-amber-500 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-4 h-4" /> Reviews ({userReviews.length})
        </button>

        <button
          onClick={() => setActiveTab('lists')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'lists'
              ? 'border-amber-500 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <List className="w-4 h-4" /> Watchlists ({userWatchlists.length})
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`pb-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeTab === 'ai'
              ? 'border-amber-500 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" /> AI Taste Profile
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {userReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userReviews.map((r) => (
                  <ReviewCard key={r.id || r._id} review={r} />
                ))}
              </div>
            ) : (
              <div className="bento-card rounded-2xl p-12 text-center text-slate-400 border border-slate-800 bg-slate-900/50">
                <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-slate-300">No published reviews yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isOwnProfile ? 'Browse movies and share your thoughts to build your profile!' : 'This user has not written any reviews yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="space-y-4">
            {userWatchlists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userWatchlists.map((list) => (
                  <div key={list.id || list._id} className="bento-card rounded-2xl p-6 space-y-4 bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">{list.name || list.title}</h3>
                      <span className="text-xs font-mono text-slate-400">{list.movies ? list.movies.length : (list.movieCount || 0)} movies</span>
                    </div>
                    <p className="text-xs text-slate-400">{list.description || 'Curated movie collection.'}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                      <span>{list.likes || 0} likes</span>
                      <span className="text-amber-400 font-mono text-[11px]">{list.isPublic ? 'Public List' : 'Private List'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bento-card rounded-2xl p-12 text-center text-slate-400 border border-slate-800 bg-slate-900/50">
                <List className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="font-semibold text-slate-300">No curated watchlists yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  {isOwnProfile ? 'Create a watchlist to organize your favorite movies!' : 'This user has not created any public watchlists.'}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="bento-card rounded-3xl p-8 sm:p-10 space-y-8 bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5 font-semibold">
                  <Zap className="w-4 h-4 text-amber-400" /> Taste DNA Archetype
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {aiTasteProfile.archetype}
                </h2>
              </div>
            </div>

            {/* AI Summary */}
            <p className="text-sm text-slate-300 leading-relaxed p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
              "{aiTasteProfile.aiSummary}"
            </p>

            {/* Genre breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiTasteProfile.topGenres.map((g) => (
                <div key={g.name} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-200">
                    <span className="font-semibold">{g.name}</span>
                    <span className="font-mono text-amber-400 font-semibold">{g.score}% Match</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${g.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

