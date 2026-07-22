import Review from "../models/Review.js";
import Movie from "../models/Movie.js";

async function updateMediaRating(movieId) {
  const reviews = await Review.find({ movieId });

  if (reviews.length === 0) {
    await Movie.findByIdAndUpdate(movieId, { avgRating: 0, ratingCount: 0 });
    return;
  }

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  const avg = total / reviews.length;

  await Movie.findByIdAndUpdate(movieId, {
    avgRating: avg.toFixed(1),
    ratingCount: reviews.length,
  });
}

export default updateMediaRating;
