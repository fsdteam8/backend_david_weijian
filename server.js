import dotenv from "dotenv";
dotenv.config();
import express from "express";
import dbconfig from "./src/db/dbconfig.js";
import cors from "cors";
import session from "express-session";
import passport from "./src/util/passport.util.js";

//express app
const app = express();

// middleware
app.use(express.json());



// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// importing routes
import authRouter from "./src/route/auth.route.js";
import userProfileRoutes from "./src/route/userProfile.route.js";
import adminRoutes from "./src/route/admin.route.js";
import supervisorRoutes from "./src/route/supervisor.route.js";
import contactUsRoutes from "./src/route/contactUs.route.js";
import bugReport from "./src/route/bugReport.route.js";
import testCentre from "./src/route/testCentre.route.js";
import routeCentre from "./src/route/routeCentre.route.js";
import importRoute from "./src/route/importRoute.route.js";
import attemptedTestRoute from "./src/route/attemptedTest.route.js";
import google0Auth from "./src/route/googleLogin.route.js"
import subscriptionRoute from "./src/route/subscription.route.js";
import transactionRoute from "./src/route/transaction.route.js";

// Set
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userProfileRoutes)
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/supervisor", supervisorRoutes)
app.use("/api/v1", contactUsRoutes)
app.use("/api/v1/bug-report", bugReport)
app.use("/api/v1/test-centre", testCentre)
app.use("/api/v1/route-details", routeCentre)
app.use("/api/v1/import-route", importRoute)
app.use("/api/v1/attempted-test", attemptedTestRoute)
app.use("/api/v1/auth", google0Auth)
app.use("/api/v1/subscription", subscriptionRoute)
app.use("/api/v1/transaction", transactionRoute)

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
