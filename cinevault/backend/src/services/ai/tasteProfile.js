import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTasteSummary(reviews) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const reviewText = reviews
      .map((r) => `Movie: ${r.movieId.title}, Genres: ${r.movieId.genres ? r.movieId.genres.join(", ") : ""}, Rating: ${r.rating}/5`)
      .join("\n");

    const prompt = `Based on these movie reviews, write a short 2-sentence summary of this user's taste in movies:\n\n${reviewText}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("AI Taste Summary error, using fallback:", error.message);
    return "This viewer appreciates narrative depth, complex characters, and visually compelling cinematic storytelling.";
  }
}

export default generateTasteSummary;