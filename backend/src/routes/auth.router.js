import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getUserProfile,
} from "../controllers/auth.controller.js";

import { registerMiddleware, verifyToken } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerMiddleware, registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", verifyToken, getMe);
authRouter.get("/user/:username", getUserProfile);

export default authRouter;

