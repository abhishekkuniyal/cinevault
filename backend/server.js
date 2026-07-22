import "dotenv/config";
import dns from "node:dns";
// Fix: System DNS (Cloudflare 1.1.1.1) fails to resolve MongoDB Atlas hostnames.
// Force Google DNS which resolves correctly.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

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
