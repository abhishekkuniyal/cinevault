import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.router.js";
import cookieParser from "cookie-parser";
import reviewRouter from "./routes/review.router.js";
import movieRouter from "./routes/movie.router.js";
import listRouter from "./routes/list.router.js";
import followRouter from "./routes/follow.router.js";
import feedRouter from "./routes/feed.router.js";
import aiRouter from "./routes/ai.router.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Trust reverse proxies (Render, Vercel, Railway, Heroku, AWS) for HTTPS cookies & rate-limiting
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    // Allow local development origins
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      return callback(null, true);
    }
    // Allow configured cloud frontend URLs
    if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Fallback allowing origin dynamically for cloud preflights
    return callback(null, true);
  },
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter);
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/movies", movieRouter);
app.use("/api/feed", feedRouter);
app.use("/api/users", followRouter);
app.use("/api/lists", listRouter);
app.use("/api/ai", aiRouter);
app.use(errorHandler);


export default app;
