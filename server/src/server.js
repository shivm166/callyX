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

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
  "http://localhost:5173",
  "https://shivamcallyx.vercel.app",
  "https://callyxshivam.onrender.com",
],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", route);
app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);

app.use("/", (req, res) => {
  res.send("welcome to callX poverdby Shivam Guaswami");
}); 
try {
  await connDB();

  app.listen(port, () => {
    console.log(`server connected on ${port}`);
  });
} catch (error) {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
}
