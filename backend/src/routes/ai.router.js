import express from "express";
import { generateProfile, getProfile } from "../controllers/tasteProfile.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { searchByMood } from "../controllers/moodSearch.controller.js";


const aiRouter = express.Router();

aiRouter.post("/taste-profile/generate", verifyToken, generateProfile);
aiRouter.get("/taste-profile", verifyToken, getProfile);
aiRouter.post("/mood-search", searchByMood);
export default aiRouter;