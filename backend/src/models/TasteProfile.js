import mongoose from "mongoose";

const tasteProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    topGenres: [String],
    summary: String,
    lastGeneratedAt: Date,
  },
  { timestamps: true }
);

const TasteProfile = mongoose.model("TasteProfile", tasteProfileSchema);

export default TasteProfile;