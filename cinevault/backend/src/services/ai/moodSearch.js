import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function interpretMood(moodText) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `A user described the kind of movie they want to watch as: "${moodText}"

Based on this, return ONLY a JSON object (no markdown, no explanation) with this exact shape:
{
  "genres": ["genre1", "genre2"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

genres should be standard movie genres (Drama, Thriller, Comedy, Horror, Romance, Action, Sci-Fi, Adventure, Mystery, Crime).
keywords should be descriptive tags that capture the mood/tone (e.g. "slow-burn", "found-family", "twist-ending", "feel-good", "rain-slicked", "mind-bending").`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleaned = jsonMatch ? jsonMatch[0] : text;

    const parsed = JSON.parse(cleaned);
    return {
      genres: Array.isArray(parsed.genres) ? parsed.genres : ["Sci-Fi"],
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ["atmospheric"]
    };
  } catch (error) {
    console.error("AI Mood Interpretation error, using smart fallback:", error.message);
    
    const lower = moodText.toLowerCase();
    const genres = [];
    const keywords = [];

    // Smart genre extraction from mood text
    if (/sci-fi|science fiction|space|future|cyberpunk|robot|alien|dystopian/i.test(lower)) genres.push("Sci-Fi");
    if (/action|fight|chase|explosion|superhero|adrenaline/i.test(lower)) genres.push("Action");
    if (/thriller|suspense|tense|mind-bending|twist|psychological/i.test(lower)) genres.push("Thriller");
    if (/mystery|crime|detective|noir|investigation|murder/i.test(lower)) genres.push("Mystery", "Crime");
    if (/horror|scary|ghost|monster|creepy|terrifying|slasher/i.test(lower)) genres.push("Horror");
    if (/romance|romantic|love|relationship|couple|date/i.test(lower)) genres.push("Romance");
    if (/comedy|funny|laugh|hilarious|humor|lighthearted/i.test(lower)) genres.push("Comedy");
    if (/drama|emotional|tearjerker|family|deep|intense/i.test(lower)) genres.push("Drama");
    if (/adventure|journey|quest|exploration|epic/i.test(lower)) genres.push("Adventure");

    // Smart keyword extraction
    if (/mind-bending|twist|puzzle|complex|mind/i.test(lower)) keywords.push("mind-bending");
    if (/rain|rainy|night|dark|neon|cyberpunk|synth/i.test(lower)) keywords.push("rain-slicked", "synth-score", "atmospheric");
    if (/feel-good|cozy|wholesome|fun|happy/i.test(lower)) keywords.push("feel-good", "heartwarming");
    if (/epic|scale|grand|world-building/i.test(lower)) keywords.push("epic-scale", "world-building");
    if (/scary|dark|creepy|haunting/i.test(lower)) keywords.push("dark", "haunting", "tense");

    const finalGenres = genres.length > 0 ? Array.from(new Set(genres)) : ["Sci-Fi", "Thriller"];
    const finalKeywords = keywords.length > 0 ? Array.from(new Set(keywords)) : ["atmospheric", "thought-provoking", "mind-bending"];

    return {
      genres: finalGenres,
      keywords: finalKeywords
    };
  }
}

export default interpretMood;