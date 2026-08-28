import "dotenv/config";
import dns from "node:dns";
// Fix: System DNS (Cloudflare 1.1.1.1) on local dev machine fails to resolve MongoDB Atlas SRV hostnames.
// Only apply custom DNS override in non-production environments to avoid breaking cloud provider DNS resolution.
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    console.warn("Custom DNS fallback failed:", e.message);
  }
}

import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import "./src/jobs/syncTrending.cron.js";
const port = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("failed to connect to database", err.message);
  });
