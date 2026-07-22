import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateTags(movie) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Movie title: ${movie.title}
Genres: ${movie.genres ? movie.genres.join(", ") : ""}
Overview: ${movie.overview}

Based on this, return ONLY a JSON array (no markdown, no explanation) of 5-8 short descriptive mood/tone tags for this movie, like "slow-burn", "found-family", "twist-ending", "feel-good", "dark-comedy", "morally-gray".

Example output: ["slow-burn", "psychological", "twist-ending"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("AI Tag generation error, using fallback:", error.message);
    // Fallback tags derived from movie genres and title
    const fallback = ["thought-provoking", "cinematic"];
    if (movie.genres) {
      movie.genres.forEach(g => fallback.push(g.toLowerCase()));
    }
    return fallback;
  }
}

export default generateTags;