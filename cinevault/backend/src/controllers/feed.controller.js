import Activity from "../models/Activity.js";
import Follow from "../models/Follow.js";
import Review from "../models/Review.js";
import List from "../models/List.js";

// Helper function to format relative timestamps
function formatTimeAgo(date) {
  if (!date) return "Recently";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const DEFAULT_MOCK_FEED = [
  {
    id: "feed-1",
    type: "review",
    user: {
      username: "alex_cinephile",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    movie: { id: "dune-2", title: "Dune: Part Two", posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop" },
    rating: 5,
    text: "Villeneuve has delivered a sci-fi masterpiece for the ages. The scale is incomprehensible yet every character beat lands.",
    timestamp: "2 hours ago"
  },
  {
    id: "feed-2",
    type: "watchlist_created",
    user: {
      username: "cyber_sarah",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop"
    },
    watchlist: {
      id: "w-1",
      title: "Neon Noir & Cyberpunk Essentials",
      description: "Atmospheric, rain-slicked synth-wave masterpieces."
    },
    timestamp: "5 hours ago"
  },
  {
    id: "feed-3",
    type: "follow",
    user: {
      username: "marcus_v",
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    targetUser: "alex_cinephile",
    timestamp: "1 day ago"
  }
];

// GET the logged-in user's feed (activity from people they follow + their own, or public activities fallback)
async function getFeed(req, res) {
  try {
    const { id: userId } = req.user;

    const follows = await Follow.find({ follower: userId }).select("following");
    const followingIds = follows.map((f) => f.following);

    // Include user's own activity + followed users
    const queryUserIds = [userId, ...followingIds];

    let activities = await Activity.find({ userId: { $in: queryUserIds } })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("userId", "username avatarUrl")
      .populate("targetMovie", "title posterUrl")
      .populate("targetReview")
      .populate("targetList", "name description")
      .populate("targetUser", "username avatarUrl");

    // Fallback 1: If user network has no activities yet, show recent public activities from Activity collection
    if (!activities || activities.length === 0) {
      activities = await Activity.find({})
        .sort({ createdAt: -1 })
        .limit(30)
        .populate("userId", "username avatarUrl")
        .populate("targetMovie", "title posterUrl")
        .populate("targetReview")
        .populate("targetList", "name description")
        .populate("targetUser", "username avatarUrl");
    }

    let formattedActivities = await Promise.all(
      activities.map(async (act) => {
        const user = {
          username: act.userId?.username || "cinephile",
          name: act.userId?.username || "CineVault Member",
          avatar:
            act.userId?.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        };

        const timestamp = formatTimeAgo(act.createdAt);

        if (act.type === "review") {
          let reviewDoc = act.targetReview;
          if (!reviewDoc && act.userId?._id && act.targetMovie?._id) {
            reviewDoc = await Review.findOne({
              userId: act.userId._id,
              movieId: act.targetMovie._id,
            }).sort({ createdAt: -1 });
          }

          return {
            id: act._id,
            type: "review",
            user,
            movie: {
              id: act.targetMovie?._id || act.targetMovie || "movie-id",
              title: act.targetMovie?.title || "Untitled Film",
              posterUrl: act.targetMovie?.posterUrl,
            },
            rating: reviewDoc?.rating || 5,
            text: reviewDoc?.description || reviewDoc?.title || "Shared a review on CineVault",
            timestamp,
          };
        }

        if (act.type === "list_created" || act.type === "watchlist_created") {
          return {
            id: act._id,
            type: "watchlist_created",
            user,
            watchlist: {
              id: act.targetList?._id,
              title: act.targetList?.name || "Curated Watchlist",
              description: act.targetList?.description || "A new collection created on CineVault",
            },
            timestamp,
          };
        }

        if (act.type === "followed_user" || act.type === "follow") {
          return {
            id: act._id,
            type: "follow",
            user,
            targetUser: act.targetUser?.username || "a cinephile",
            timestamp,
          };
        }

        return null;
      })
    );

    let cleanFeed = formattedActivities.filter(Boolean);

    // Fallback 2: If Activity collection is empty, build activity feed from public Review and List documents
    if (cleanFeed.length === 0) {
      const [publicReviews, publicLists] = await Promise.all([
        Review.find({ isPublic: { $ne: false } })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("userId", "username avatarUrl")
          .populate("movieId", "title posterUrl"),
        List.find({ isPublic: { $ne: false } })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("userId", "username avatarUrl"),
      ]);

      const reviewActivities = publicReviews.map((r) => ({
        id: `rev-${r._id}`,
        type: "review",
        user: {
          username: r.userId?.username || "cinephile",
          name: r.userId?.username || "CineVault Member",
          avatar: r.userId?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        },
        movie: {
          id: r.movieId?._id || r.movieId || "movie-id",
          title: r.movieId?.title || "Film Review",
          posterUrl: r.movieId?.posterUrl,
        },
        rating: r.rating || 5,
        text: r.description || r.title || "Shared a review on CineVault",
        timestamp: formatTimeAgo(r.createdAt),
      }));

      const listActivities = publicLists.map((l) => ({
        id: `list-${l._id}`,
        type: "watchlist_created",
        user: {
          username: l.userId?.username || "cinephile",
          name: l.userId?.username || "CineVault Member",
          avatar: l.userId?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        },
        watchlist: {
          id: l._id,
          title: l.name || "Curated Watchlist",
          description: "A new collection created on CineVault",
        },
        timestamp: formatTimeAgo(l.createdAt),
      }));

      cleanFeed = [...reviewActivities, ...listActivities];
    }

    // Fallback 3: If database has zero activity, review, or list records, show default community feed
    if (cleanFeed.length === 0) {
      cleanFeed = DEFAULT_MOCK_FEED;
    }

    return res.status(200).json({ activities: cleanFeed });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET public feed (no auth required) — recent public activity for unauthenticated users
async function getPublicFeed(req, res) {
  try {
    // Try Activity collection first
    let activities = await Activity.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .populate("userId", "username avatarUrl")
      .populate("targetMovie", "title posterUrl")
      .populate("targetReview")
      .populate("targetList", "name description")
      .populate("targetUser", "username avatarUrl");

    let formattedActivities = await Promise.all(
      activities.map(async (act) => {
        const user = {
          username: act.userId?.username || "cinephile",
          name: act.userId?.username || "CineVault Member",
          avatar:
            act.userId?.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        };
        const timestamp = formatTimeAgo(act.createdAt);

        if (act.type === "review") {
          let reviewDoc = act.targetReview;
          if (!reviewDoc && act.userId?._id && act.targetMovie?._id) {
            reviewDoc = await Review.findOne({
              userId: act.userId._id,
              movieId: act.targetMovie._id,
            }).sort({ createdAt: -1 });
          }
          return {
            id: act._id,
            type: "review",
            user,
            movie: {
              id: act.targetMovie?._id || act.targetMovie || "movie-id",
              title: act.targetMovie?.title || "Untitled Film",
              posterUrl: act.targetMovie?.posterUrl,
            },
            rating: reviewDoc?.rating || 5,
            text: reviewDoc?.description || reviewDoc?.title || "Shared a review on CineVault",
            timestamp,
          };
        }
        if (act.type === "list_created" || act.type === "watchlist_created") {
          return {
            id: act._id,
            type: "watchlist_created",
            user,
            watchlist: {
              id: act.targetList?._id,
              title: act.targetList?.name || "Curated Watchlist",
              description: act.targetList?.description || "A new collection created on CineVault",
            },
            timestamp,
          };
        }
        if (act.type === "followed_user" || act.type === "follow") {
          return {
            id: act._id,
            type: "follow",
            user,
            targetUser: act.targetUser?.username || "a cinephile",
            timestamp,
          };
        }
        return null;
      })
    );

    let cleanFeed = formattedActivities.filter(Boolean);

    // Fallback: build from Review + List documents
    if (cleanFeed.length === 0) {
      const [publicReviews, publicLists] = await Promise.all([
        Review.find({ isPublic: { $ne: false } })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("userId", "username avatarUrl")
          .populate("movieId", "title posterUrl"),
        List.find({ isPublic: { $ne: false } })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("userId", "username avatarUrl"),
      ]);

      const reviewActivities = publicReviews.map((r) => ({
        id: `rev-${r._id}`,
        type: "review",
        user: {
          username: r.userId?.username || "cinephile",
          name: r.userId?.username || "CineVault Member",
          avatar: r.userId?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        },
        movie: {
          id: r.movieId?._id || r.movieId || "movie-id",
          title: r.movieId?.title || "Film Review",
          posterUrl: r.movieId?.posterUrl,
        },
        rating: r.rating || 5,
        text: r.description || r.title || "Shared a review on CineVault",
        timestamp: formatTimeAgo(r.createdAt),
      }));

      const listActivities = publicLists.map((l) => ({
        id: `list-${l._id}`,
        type: "watchlist_created",
        user: {
          username: l.userId?.username || "cinephile",
          name: l.userId?.username || "CineVault Member",
          avatar: l.userId?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        },
        watchlist: {
          id: l._id,
          title: l.name || "Curated Watchlist",
          description: "A new collection created on CineVault",
        },
        timestamp: formatTimeAgo(l.createdAt),
      }));

      cleanFeed = [...reviewActivities, ...listActivities];
    }

    // Final fallback: mock data
    if (cleanFeed.length === 0) {
      cleanFeed = DEFAULT_MOCK_FEED;
    }

    return res.status(200).json({ activities: cleanFeed });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { getFeed, getPublicFeed };