import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "../controllers/follow.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const followRouter = express.Router();

followRouter.post("/:userId/follow", verifyToken, followUser);
followRouter.delete("/:userId/unfollow", verifyToken, unfollowUser);
followRouter.get("/:userId/followers", getFollowers);
followRouter.get("/:userId/following", getFollowing);

export default followRouter;
