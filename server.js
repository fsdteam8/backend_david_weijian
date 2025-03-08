import dotenv from "dotenv";
import express from "express";
import dbconfig from "./src/db/dbconfig.js";

const app = express();

// middleware
app.use(express.json());

dotenv.config();

// importing routes
import authRouter from "./src/route/auth.route.js"
import userProfileRoutes from "./src/route/userProfile.route.js"

// Set
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userProfileRoutes);

// Database and port
dbconfig()
  .then(() => {
    app.on("error", (err) => {
      console.log(`Error while listening on port: ${process.env.PORT}`, err);
      throw err;
    });

    app.listen(process.env.PORT || 5003, () => {
      console.log(`The server is listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to database`, err);
    throw err;
  });
