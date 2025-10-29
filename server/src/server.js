import express from "express";
import "dotenv/config";
import route from "./routes/authRoute.js";
import connDB from "./lib/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

const port = process.env.PORT || 4001;
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/auth", route);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);

app.listen(port, () => {
  console.log(`server connected on ${port}`);
  connDB();
});
