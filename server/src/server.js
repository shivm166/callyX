import express from "express";
import "dotenv/config";
import route from "./routes/authRoute.js";
import connDB from "./lib/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

const port = process.env.PORT || 4001;
const app = express();
const __dirname = path.resolve();

// parse bodies
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS options object - single place to edit
const corsOptions = {
  origin: [
    "https://shivamcallyx.vercel.app",
    "https://callyx.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// apply CORS globally
app.use(cors(corsOptions));

// Explicitly respond to OPTIONS for all routes (preflight)
app.options("*", cors(corsOptions));

// Add a small middleware to always include CORS headers even on errors/redirects
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
  res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
  if (corsOptions.credentials) {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  // proceed
  next();
});

// your routes
app.use("/api/auth", route);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);

// fallback route
app.get("/", (req, res) => {
  res.send("welcome to callX powered by Shivam Gauswami");
});

// start server after DB
try {
  await connDB();
  app.listen(port, () => {
    console.log(`server connected on ${port}`);
  });
} catch (error) {
  console.error(" Failed to start server:", error);
  process.exit(1);
}
