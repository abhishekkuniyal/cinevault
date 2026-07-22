import Review from "../models/Review.js";
import TasteProfile from "../models/TasteProfile.js";
import generateTasteSummary from "../services/ai/tasteProfile.js";

async function generateProfile(req, res) {
  try {
    const { id: userId } = req.user;

    const reviews = await Review.find({ userId }).populate("movieId", "title genres");

    if (reviews.length < 3) {
      return res.status(400).json({
        message: "Write at least 3 reviews before generating a taste profile",
      });
    }

    const genreCounts = {};
    reviews.forEach((r) => {
      r.movieId.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre]) => genre);

    const summary = await generateTasteSummary(reviews);

    const profile = await TasteProfile.findOneAndUpdate(
      { userId },
      { topGenres, summary, lastGeneratedAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: "Taste profile generated", profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getProfile(req, res) {
  try {
    const { id: userId } = req.user;
    const profile = await TasteProfile.findOne({ userId });

    if (!profile) {
      return res.status(404).json({ message: "No taste profile yet — generate one first" });
    }

    return res.status(200).json({ profile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { generateProfile, getProfile };