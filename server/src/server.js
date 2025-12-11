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

// parse bodies (express.json is enough, but kept body-parser if you need urlencoded config)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// allowed origins list
const allowedOrigins = [
  "https://shivamcallyx.vercel.app",
  "https://callyx.vercel.app",
  "http://localhost:5173",
];

// CORS options with dynamic origin handling (works with credentials)
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile apps, postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// apply CORS middleware globally
app.use(cors(corsOptions));

// explicitly allow preflight for all routes using cors middleware (no undefined handler)
app.options("*", cors(corsOptions));

// Optional: custom header-setting middleware (kept but not required when using cors())
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", corsOptions.methods.join(","));
  res.setHeader(
    "Access-Control-Allow-Headers",
    corsOptions.allowedHeaders.join(",")
  );
  if (corsOptions.credentials) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
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
  console.error("Failed to start server:", error);
  process.exit(1);
}
