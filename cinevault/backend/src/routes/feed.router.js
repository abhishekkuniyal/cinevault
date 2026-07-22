import express from "express";
import { getFeed, getPublicFeed } from "../controllers/feed.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const feedRouter = express.Router();

feedRouter.get("/public", getPublicFeed);
feedRouter.get("/", verifyToken, getFeed);

export default feedRouter;