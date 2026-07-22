import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["review", "list_created", "followed_user", "watchlist_created", "follow"],
      required: true,
    },
    targetMovie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    targetReview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
    targetList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
