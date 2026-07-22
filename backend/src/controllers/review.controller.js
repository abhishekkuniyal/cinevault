import Review from "../models/Review.js";
import Movie from "../models/Movie.js";
import updateMediaRating from "../utils/updateMediaRating.js";
import Activity from "../models/Activity.js";

// create a review
async function createReview(req, res) {
  try {
    const { movieId, title, description, text, rating, hasSpoiler } = req.body;

    const { id: userId } = req.user;

    // Accept "text" from frontend as "description"
    const reviewDescription = description || text;
    const reviewTitle = title || "My Review";

    if (!movieId || !reviewDescription || !rating) {
      return res.status(400).json({ message: "Missing required Fields" });
    }

    const movieExists = await Movie.findById(movieId).catch(() => null)
      || await Movie.findOne({ tmdbId: movieId });
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const review = await Review.create({
      userId,
      movieId: movieExists._id,
      title: reviewTitle,
      description: reviewDescription,
      rating: Math.min(Math.max(rating, 1), 5), // clamp to 1-5 range
      hasSpoiler: !!hasSpoiler,
    });
    await Activity.create({
      userId,
      type: "review",
      targetMovie: movieExists._id,
      targetReview: review._id,
    });

    await updateMediaRating(movieExists._id);

    return res
      .status(201)
      .json({ message: "Review created successfully", review });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET all reviews for a movie
async function getReviews(req, res) {
  try {
    const { movieId } = req.params;

    const movieExists = await Movie.findOne({ tmdbId: movieId })
      || await Movie.findById(movieId).catch(() => null);
    if (!movieExists) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const reviews = await Review.find({ movieId: movieExists._id })
      .populate("userId", "username email");

    const formatted = reviews.map(r => ({
      id: r._id,
      _id: r._id,
      rating: r.rating || 5,
      title: r.title,
      content: r.description || r.title,
      description: r.description,
      movieTitle: movieExists.title,
      movieId: movieExists._id,
      user: {
        username: r.userId?.username || "cinephile",
        name: r.userId?.username || "CineVault Member",
      },
      date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likesCount: r.likesCount || 0,
      hasSpoiler: r.hasSpoiler || false,
      aiSentiment: r.aiSentiment || 'Positive'
    }));

    return res.status(200).json({ reviews: formatted });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET all reviews by a user
async function getUserReviews(req, res) {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ userId })
      .populate("userId", "username email")
      .populate("movieId", "title posterUrl");

    const formatted = reviews.map(r => ({
      id: r._id,
      _id: r._id,
      rating: r.rating || 5,
      title: r.title,
      content: r.description || r.title,
      description: r.description,
      movieTitle: r.movieId?.title || "Film Review",
      movieId: r.movieId?._id || r.movieId,
      user: {
        username: r.userId?.username || "cinephile",
        name: r.userId?.username || "CineVault Member",
      },
      date: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likesCount: r.likesCount || 0,
      hasSpoiler: r.hasSpoiler || false,
      aiSentiment: r.aiSentiment || 'Positive'
    }));

    return res.status(200).json({ reviews: formatted });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}


// DELETE a review
async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { id: userId } = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    const { movieId } = review;

    await review.deleteOne();

    await updateMediaRating(movieId);

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// UPDATE a review (only by the user who created it)
async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { id: userId } = req.user;
    const { title, description, rating } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this review" });
    }

    if (title !== undefined) review.title = title;
    if (description !== undefined) review.description = description;
    if (rating !== undefined) review.rating = rating;

    await review.save();

    await updateMediaRating(review.movieId);

    return res
      .status(200)
      .json({ message: "Review updated successfully", review });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

// GET recent public reviews across all movies
async function getRecentPublicReviews(req, res) {
  try {
    const reviews = await Review.find({ isPublic: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "username email avatarUrl")
      .populate("movieId", "title posterUrl");

    const formatted = reviews.map((r) => ({
      id: r._id,
      _id: r._id,
      rating: r.rating || 5,
      title: r.title,
      content: r.description || r.title,
      description: r.description,
      movieTitle: r.movieId?.title || "Film Review",
      movieId: r.movieId?._id || r.movieId,
      user: {
        username: r.userId?.username || "cinephile",
        name: r.userId?.username || "CineVault Member",
        avatar:
          r.userId?.avatarUrl ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      },
      date: new Date(r.createdAt || Date.now()).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      likesCount: 24,
      hasSpoiler: false,
      aiSentiment: "Positive",
    }));

    return res.status(200).json({ reviews: formatted });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { createReview, getReviews, getUserReviews, deleteReview, updateReview, getRecentPublicReviews };
