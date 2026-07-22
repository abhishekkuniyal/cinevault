import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  hasSpoiler: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
