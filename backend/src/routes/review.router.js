import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  getUserReviews,
  updateReview,
  getRecentPublicReviews,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const reviewRouter = express.Router();

reviewRouter.get("/recent", getRecentPublicReviews);
reviewRouter.post("/createReview", verifyToken, createReview);
reviewRouter.get("/getReview/:movieId", getReviews);
reviewRouter.get("/user/:userId", getUserReviews);
reviewRouter.put("/updateReview/:reviewId", verifyToken, updateReview);
reviewRouter.delete("/deleteReview/:reviewId", verifyToken, deleteReview);
export default reviewRouter;
