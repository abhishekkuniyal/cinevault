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
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
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
